import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Task } from './types';

interface AppStore {
  currentUser: Employee | null;
  employees: Employee[];
  tasks: Task[];
  setCurrentUser: (user: Employee | null) => void;
  addEmployee: (employee: Employee) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStage: Task['stage']) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      currentUser: null,
      employees: [
        {
          id: '1',
          name: 'Арина',
          email: 'arina@company.kz',
          avatar: 'A',
          color: '#3b82f6',
          role: 'Менеджер'
        },
        {
          id: '2',
          name: 'Нурхат',
          email: 'nurhat@company.kz',
          avatar: 'N',
          color: '#ef4444',
          role: 'Разработчик'
        },
        {
          id: '3',
          name: 'Дина',
          email: 'dina@company.kz',
          avatar: 'D',
          color: '#10b981',
          role: 'Дизайнер'
        },
        {
          id: '4',
          name: 'Данияр',
          email: 'daniyar@company.kz',
          avatar: 'Д',
          color: '#f59e0b',
          role: 'Аналитик'
        },
        {
          id: '5',
          name: 'Лира',
          email: 'lira@company.kz',
          avatar: 'L',
          color: '#8b5cf6',
          role: 'Координатор'
        }
      ],
      tasks: [],

      setCurrentUser: (user) => set({ currentUser: user }),
      
      addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),
      
      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
          ),
        })),
      
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      
      moveTask: (taskId, newStage) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, stage: newStage, updatedAt: new Date().toISOString() }
              : task
          ),
        })),
    }),
    {
      name: 'task-manager-storage',
    }
  )
);
