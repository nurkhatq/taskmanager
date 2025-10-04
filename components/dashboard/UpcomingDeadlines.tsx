'use client';

import { useTasks } from '@/hooks/useTasks';
import { formatDate, isOverdue } from '@/lib/utils';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function UpcomingDeadlines() {
  const { tasks } = useTasks();

  // Задачи с дедлайнами, отсортированные по срочности
  const upcomingTasks = tasks
    .filter(task => task.dueDate && task.stage !== 'done' && task.stage !== 'cancelled')
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar size={20} />
        Ближайшие дедлайны
      </h3>
      <div className="space-y-3">
        {upcomingTasks.map(task => {
          const taskIsOverdue = isOverdue(task.dueDate);
          return (
            <div
              key={task.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                taskIsOverdue
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {taskIsOverdue && <AlertTriangle size={14} className="text-red-600" />}
                    <span
                      className={`text-xs ${
                        taskIsOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {task.dueDate && formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                <Badge variant={task.priority === 'urgent' ? 'danger' : 'default'}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          );
        })}
        {upcomingTasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">Нет задач с дедлайнами</p>
        )}
      </div>
    </div>
  );
}