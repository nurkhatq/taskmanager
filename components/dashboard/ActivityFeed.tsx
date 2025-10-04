'use client';

import { useTasks } from '@/hooks/useTasks';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { Clock, CheckCircle2, AlertCircle, Edit } from 'lucide-react';

export function ActivityFeed() {
  const { tasks } = useTasks();
  const { employees } = useStore();

  // Последние активности (последние 10 обновленных задач)
  const activities = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10)
    .map(task => {
      const assignee = employees.find(e => e.id === task.assigneeId);
      return { task, assignee };
    });

  const getActivityIcon = (stage: string) => {
    switch (stage) {
      case 'done':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'in_progress':
        return <Clock size={16} className="text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Edit size={16} className="text-blue-600" />;
    }
  };

  const getActivityText = (stage: string) => {
    switch (stage) {
      case 'done':
        return 'завершена';
      case 'in_progress':
        return 'в работе';
      case 'cancelled':
        return 'отменена';
      case 'review':
        return 'на проверке';
      case 'todo':
        return 'к выполнению';
      default:
        return 'обновлена';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Активность</h3>
      <div className="space-y-4">
        {activities.map(({ task, assignee }) => (
          <div key={task.id} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getActivityIcon(task.stage)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{task.title}</span>{' '}
                <span className="text-gray-600">{getActivityText(task.stage)}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                {assignee && (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: assignee.color }}
                  >
                    {assignee.avatar}
                  </div>
                )}
                <span className="text-xs text-gray-500">
                  {formatDate(task.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center text-gray-500 py-4">Нет активности</p>
        )}
      </div>
    </div>
  );
}