'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { useTasks } from '@/hooks/useTasks';

export default function BoardPage() {
  const router = useRouter();
  const { currentUser } = useStore();
  const { stats } = useTasks();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden p-6">
          <div className="h-full flex flex-col">
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Kanban доска
              </h2>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>Перетаскивайте задачи между колонками для изменения статуса</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Всего: <strong>{stats.total}</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    В работе: <strong>{stats.inProgress}</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Завершено: <strong>{stats.completed}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-hidden">
              <KanbanBoard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}