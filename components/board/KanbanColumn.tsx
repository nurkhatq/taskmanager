'use client';

import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { getStageLabel } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: Task['stage'];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  provided: any;
  snapshot: any;
}

export function KanbanColumn({ stage, tasks, onTaskClick, provided, snapshot }: KanbanColumnProps) {
  const stageColors: Record<Task['stage'], string> = {
    backlog: 'bg-gray-100 text-gray-700 border-gray-300',
    todo: 'bg-blue-100 text-blue-700 border-blue-300',
    in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    review: 'bg-purple-100 text-purple-700 border-purple-300',
    done: 'bg-green-100 text-green-700 border-green-300',
    cancelled: 'bg-red-100 text-red-700 border-red-300',
  };

  const stageIcons: Record<Task['stage'], string> = {
    backlog: '📋',
    todo: '📝',
    in_progress: '🔄',
    review: '👀',
    done: '✅',
    cancelled: '❌',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{stageIcons[stage]}</span>
          <h3 className="font-bold text-gray-900 text-lg">
            {getStageLabel(stage)}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${stageColors[stage]}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={`flex-1 space-y-3 min-h-[500px] p-3 rounded-xl transition-all duration-200 ${
          snapshot.isDraggingOver
            ? 'bg-primary-50 ring-2 ring-primary-400 ring-offset-2'
            : 'bg-gray-50'
        }`}
      >
        {tasks.length === 0 && !snapshot.isDraggingOver && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Plus size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Перетащите задачу сюда</p>
            </div>
          </div>
        )}

        {tasks.map((task, index) => (
          <div key={task.id}>
            <TaskCard task={task} onClick={() => onTaskClick(task)} />
          </div>
        ))}
        {provided.placeholder}
      </div>
    </div>
  );
}