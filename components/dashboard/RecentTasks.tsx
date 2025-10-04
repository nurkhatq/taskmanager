'use client';

import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/board/TaskCard';
import { useState } from 'react';
import { Task } from '@/lib/types';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Clock } from 'lucide-react';

export function RecentTasks() {
  const { tasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-primary-600" />
            Последние задачи
          </h3>
          <span className="text-sm text-gray-500">
            Обновлено сегодня
          </span>
        </div>

        <div className="space-y-3">
          {recentTasks.map(task => (
            <div 
              key={task.id}
              className="transform transition-transform hover:scale-[1.02]"
            >
              <TaskCard task={task} onClick={() => setSelectedTask(task)} />
            </div>
          ))}
          
          {recentTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Нет задач</p>
              <p className="text-gray-400 text-sm mt-1">
                Создайте свою первую задачу
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}