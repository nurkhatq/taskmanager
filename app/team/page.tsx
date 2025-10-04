'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Employee } from '@/lib/types';
import { Mail, Briefcase, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function TeamPage() {
  const router = useRouter();
  const { currentUser, employees, addEmployee } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#6366f1'
  ];

  const handleAddEmployee = () => {
    if (!newEmployee.name.trim() || !newEmployee.email.trim() || !newEmployee.role.trim()) {
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name.trim(),
      email: newEmployee.email.trim(),
      role: newEmployee.role.trim(),
      avatar: newEmployee.name[0].toUpperCase(),
      color: COLORS[employees.length % COLORS.length],
    };

    addEmployee(employee);
    setNewEmployee({ name: '', email: '', role: '' });
    setShowAddModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Команда</h2>
                <p className="text-gray-600">Управление сотрудниками и их ролями</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                <Plus size={20} />
                Добавить сотрудника
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                      style={{ backgroundColor: emp.color }}
                    >
                      {emp.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {emp.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Briefcase size={14} />
                        <span className="truncate">{emp.role}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Mail size={14} />
                        <span className="truncate">{emp.email}</span>
                      </div>
                    </div>
                  </div>

                  {emp.id === currentUser.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                        Вы
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Новый сотрудник</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  placeholder="Введите имя"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  placeholder="email@company.kz"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Должность
                </label>
                <input
                  type="text"
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                  placeholder="Менеджер, Разработчик и т.д."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleAddEmployee}
                disabled={
                  !newEmployee.name.trim() ||
                  !newEmployee.email.trim() ||
                  !newEmployee.role.trim()
                }
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}