import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { getTaskStats } from '@/lib/utils';

export function useTasks() {
  const { tasks, currentUser, addTask, updateTask, deleteTask, moveTask } = useStore();

  const userTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(task => task.assigneeId === currentUser.id);
  }, [tasks, currentUser]);

  const stats = useMemo(() => {
    if (!currentUser) return { total: 0, completed: 0, inProgress: 0, overdue: 0, completionRate: 0 };
    return getTaskStats(tasks, currentUser.id);
  }, [tasks, currentUser]);

  const tasksByStage = useMemo(() => {
    const stages = ['backlog', 'todo', 'in_progress', 'review', 'done'] as const;
    return stages.reduce((acc, stage) => {
      acc[stage] = userTasks.filter(task => task.stage === stage);
      return acc;
    }, {} as Record<string, typeof userTasks>);
  }, [userTasks]);

  return {
    tasks: userTasks,
    stats,
    tasksByStage,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
