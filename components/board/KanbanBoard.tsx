'use client';

import { useState } from 'react';
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';
import { getStageLabel } from '@/lib/utils';

export function KanbanBoard() {
  const { tasksByStage, moveTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const stages: Task['stage'][] = ['backlog', 'todo', 'in_progress', 'review', 'done'];

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStage = destination.droppableId as Task['stage'];
    moveTask(draggableId, newStage);
  };

  const stageColors: Record<Task['stage'], string> = {
    backlog: 'bg-gray-100 text-gray-700',
    todo: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    review: 'bg-purple-100 text-purple-700',
    done: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-4 h-full">
          {stages.map((stage) => {
            const tasks = tasksByStage[stage] || [];
            return (
              <div key={stage} className="bg-gray-50 rounded-xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-50 pb-4 z-10">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {getStageLabel(stage)}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${stageColors[stage]}`}
                    >
                      {tasks.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver
                          ? 'bg-primary-50 ring-2 ring-primary-300'
                          : ''
                      }`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'opacity-50' : ''}
                            >
                              <TaskCard task={task} onClick={() => setSelectedTask(task)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}