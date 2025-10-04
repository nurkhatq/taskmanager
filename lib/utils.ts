import { Task, TaskStats } from './types';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(date: string): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: ru });
}

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return isBefore(new Date(dueDate), startOfDay(new Date()));
}

export function getTaskStats(tasks: Task[], userId: string): TaskStats {
  const userTasks = tasks.filter(t => t.assigneeId === userId);
  const total = userTasks.length;
  const completed = userTasks.filter(t => t.stage === 'done').length;
  const inProgress = userTasks.filter(t => t.stage === 'in_progress').length;
  const overdue = userTasks.filter(t => isOverdue(t.dueDate) && t.stage !== 'done').length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return { total, completed, inProgress, overdue, completionRate };
}

export function getPriorityColor(priority: Task['priority']): string {
  const colors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[priority];
}

export function getPriorityLabel(priority: Task['priority']): string {
  const labels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочно',
  };
  return labels[priority];
}

export function getStageLabel(stage: Task['stage']): string {
  const labels = {
    backlog: 'Бэклог',
    todo: 'К выполнению',
    in_progress: 'В работе',
    review: 'На проверке',
    done: 'Готово',
    cancelled: 'Отменено',
  };
  return labels[stage];
}

