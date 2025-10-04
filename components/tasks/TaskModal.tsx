'use client';

import { useState } from 'react';
import { X, Calendar, Tag, Paperclip, MessageSquare, Trash2, Save, Plus } from 'lucide-react';
import { Task, SubTask, Comment } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { formatDate, getPriorityLabel, getStageLabel } from '@/lib/utils';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskModal({ task: initialTask, onClose }: TaskModalProps) {
  const { updateTask, deleteTask, employees, currentUser } = useStore();
  const [task, setTask] = useState(initialTask);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    updateTask(task.id, task);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const subtask: SubTask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
    };
    setTask({ ...task, subtasks: [...task.subtasks, subtask] });
    setNewSubtask('');
  };

  const toggleSubtask = (id: string) => {
    setTask({
      ...task,
      subtasks: task.subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      ),
    });
  };

  const deleteSubtask = (id: string) => {
    setTask({ ...task, subtasks: task.subtasks.filter((st) => st.id !== id) });
  };

  const addComment = () => {
    if (!newComment.trim() || !currentUser) return;
    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setTask({ ...task, comments: [...task.comments, comment] });
    setNewComment('');
  };

  const addTag = () => {
    if (!newTag.trim() || task.tags.includes(newTag.trim())) return;
    setTask({ ...task, tags: [...task.tags, newTag.trim()] });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setTask({ ...task, tags: task.tags.filter((t) => t !== tag) });
  };

  const assignee = employees.find((e) => e.id === task.assigneeId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="text-2xl font-bold text-gray-900 w-full border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
            />
            <div className="flex items-center gap-3 mt-3">
              <Badge variant={task.priority === 'urgent' ? 'danger' : 'default'}>
                {getPriorityLabel(task.priority)}
              </Badge>
              <Badge variant="info">{getStageLabel(task.stage)}</Badge>
              {assignee && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: assignee.color }}
                  >
                    {assignee.avatar}
                  </div>
                  <span className="text-sm text-gray-600">{assignee.name}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Добавьте описание задачи..."
              />
            </div>

            {/* Subtasks */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Подзадачи ({task.subtasks.filter((st) => st.completed).length}/
                {task.subtasks.length})
              </label>
              <div className="space-y-2 mb-3">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span
                      className={`flex-1 ${
                        subtask.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(subtask.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                  placeholder="Добавить подзадачу..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={addSubtask}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Комментарии ({task.comments.length})
              </label>
              <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
                {task.comments.map((comment) => {
                  const user = employees.find((e) => e.id === comment.userId);
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: user?.color || '#gray' }}
                      >
                        {user?.avatar}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">
                            {user?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addComment()}
                  placeholder="Добавить комментарий..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={addComment}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={task.stage}
                onChange={(e) =>
                  setTask({ ...task, stage: e.target.value as Task['stage'] })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="backlog">Бэклог</option>
                <option value="todo">К выполнению</option>
                <option value="in_progress">В работе</option>
                <option value="review">На проверке</option>
                <option value="done">Готово</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Приоритет
              </label>
              <select
                value={task.priority}
                onChange={(e) =>
                  setTask({ ...task, priority: e.target.value as Task['priority'] })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочно</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Срок выполнения
              </label>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Оценка (часы)
              </label>
              <input
                type="number"
                value={task.estimatedHours || ''}
                onChange={(e) =>
                  setTask({ ...task, estimatedHours: Number(e.target.value) })
                }
                placeholder="0"
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Теги
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold flex items-center gap-1 group"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Добавить тег..."
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Исполнитель
              </label>
              <select
                value={task.assigneeId}
                onChange={(e) => setTask({ ...task, assigneeId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timestamps */}
            <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
              <p>Создано: {formatDate(task.createdAt)}</p>
              <p>Обновлено: {formatDate(task.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
          >
            <Trash2 size={18} />
            Удалить
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-semibold"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              <Save size={18} />
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}