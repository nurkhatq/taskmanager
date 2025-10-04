'use client';

import { Task } from '@/lib/types';
import { Calendar, MessageSquare, Paperclip, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate, isOverdue, getPriorityColor, getPriorityLabel } from '@/lib/utils';
import { useStore } from '@/lib/store';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { employees } = useStore();
  const assignee = employees.find(e => e.id === task.assigneeId);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const isTaskOverdue = isOverdue(task.dueDate);

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {task.title}
          </h4>
        </div>
        <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'}>
          {getPriorityLabel(task.priority)}
        </Badge>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isTaskOverdue ? 'text-red-600 font-semibold' : ''}`}>
              {isTaskOverdue && <AlertCircle size={14} />}
              <Calendar size={14} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.subtasks.length > 0 && (
            <div className="flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>{completedSubtasks}/{task.subtasks.length}</span>
            </div>
          )}
          
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>{task.comments.length}</span>
            </div>
          )}
          
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip size={14} />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {assignee && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ backgroundColor: assignee.color }}
            title={assignee.name}
          >
            {assignee.avatar}
          </div>
        )}
      </div>
    </div>
  );
}