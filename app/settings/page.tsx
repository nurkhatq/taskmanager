'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Trash2, Download, Upload, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, tasks, employees } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const handleExport = () => {
    const data = {
      employees,
      tasks,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        localStorage.setItem('task-manager-storage', JSON.stringify({ state: data }));
        window.location.reload();
      } catch (error) {
        alert('Ошибка при импорте данных');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Настройки</h2>
              <p className="text-gray-600">Управление данными и настройками приложения</p>
            </div>

            <div className="space-y-6">
              {/* Data Management */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Управление данными
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Экспорт данных</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Скачать резервную копию всех задач и сотрудников
                      </p>
                    </div>
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                      <Download size={18} />
                      Экспорт
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Импорт данных</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Восстановить данные из резервной копии
                      </p>
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold cursor-pointer">
                      <Upload size={18} />
                      Импорт
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <h4 className="font-semibold text-red-900">Очистить все данные</h4>
                      <p className="text-sm text-red-600 mt-1">
                        Удалить все задачи и сбросить настройки
                      </p>
                    </div>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      <Trash2 size={18} />
                      Очистить
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-semibold">Всего задач</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{tasks.length}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-semibold">Сотрудников</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">
                      {employees.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Подтвердите удаление
                </h3>
                <p className="text-gray-600">
                  Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Удалить все
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}