'use client';

import { Bell, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { QuickAddTask } from '@/components/tasks/QuickAddTask';
import { useStore } from '@/lib/store';
import { useTasks } from '@/hooks/useTasks';

export function Header() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks } = useTasks();
  const { currentUser } = useStore();

  // Уведомления о просроченных задачах
  const overdueCount = tasks.filter(task => {
    if (!task.dueDate || task.stage === 'done') return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск задач, проектов, сотрудников..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Bell size={20} className="text-gray-600 group-hover:text-gray-900" />
              {overdueCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {overdueCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Быстрое добавление</span>
            </button>
          </div>
        </div>
      </header>

      {showQuickAdd && <QuickAddTask onClose={() => setShowQuickAdd(false)} />}
    </>
  );
}
