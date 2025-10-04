export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  role: string;
}

export type TaskStage = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  stage: TaskStage;
  priority: TaskPriority;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedHours?: number;
  tags: string[];
  attachments: string[];
  subtasks: SubTask[];
  comments: Comment[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
}