'use client';

import { useState } from 'react';
import { X, Plus, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Task } from '@/lib/types';

interface QuickAddTaskProps {
  onClose: () => void;
}

export function QuickAddTask({ onClose }: QuickAddTaskProps) {
  const { currentUser, addTask } = useStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [stage, setStage] = useState<Task['stage']>('todo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: '',
      stage,
      priority,
      assigneeId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      attachments: [],
      subtasks: [],
      comments: [],
    };

    addTask(newTask);
    setTitle('');
    setStage('todo');
    setPriority('medium');
    onClose();
  };

  const priorityOptions = [
    { value: 'low', label: 'Низкий', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'medium', label: 'Средний', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'high', label: 'Высокий', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { value: 'urgent', label: 'Срочно', color: 'bg-red-100 text-red-700 border-red-300' },
  ] as const;

  const stageOptions = [
    { value: 'backlog', label: 'Бэклог', icon: '📋' },
    { value: 'todo', label: 'К выполнению', icon: '📝' },
    { value: 'in_progress', label: 'В работе', icon: '🔄' },
    { value: 'review', label: 'На проверке', icon: '👀' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Быстрое добавление</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Название задачи <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Подготовить отчет по продажам"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Stage Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Статус
            </label>
            <div className="grid grid-cols-2 gap-2">
              {stageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStage(option.value)}
                  className={`py-3 px-3 rounded-lg border-2 text-sm font-semibold transition-all flex items-center gap-2 justify-center ${
                    stage === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Приоритет
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`py-3 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                    priority === option.value
                      ? `${option.color} shadow-md scale-105`
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
          >
            <Plus size={20} />
            Создать задачу
          </button>

          {/* Hint */}
          <p className="text-xs text-gray-500 text-center">
            Вы можете добавить детали позже в модальном окне редактирования
          </p>
        </form>
      </div>
    </div>
  );
}