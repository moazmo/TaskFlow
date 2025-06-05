// Types shared between main and renderer processes
export interface Task {
  id?: number;
  title: string;
  description?: string;
  projectId?: number;
  priority: number; // 0: Low, 1: Medium, 2: High, 3: Urgent
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  parentTaskId?: number;
}

export interface Project {
  id?: number;
  name: string;
  color?: string;
  createdAt?: string;
}
