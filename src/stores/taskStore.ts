import { create } from 'zustand';
import { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null;
  filter: {
    status: 'all' | 'pending' | 'in_progress' | 'completed';
    priority: 'all' | '0' | '1' | '2' | '3';
    projectId: number | null;
    search: string;
  };
  
  // Actions
  loadTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  setFilter: (filter: Partial<TaskStore['filter']>) => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTask: null,
  filter: {
    status: 'all',
    priority: 'all',
    projectId: null,
    search: '',
  },
  loadTasks: async () => {
    try {
      const tasks = await window.electronAPI.getTasks();
      set({ tasks });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      // Fallback to sample data for testing
      const sampleTasks: Task[] = [
        {
          id: 1,
          title: 'Complete project documentation',
          description: 'Update the README and API documentation',
          projectId: 1,
          priority: 2,
          status: 'pending',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Review code changes',
          description: 'Review the latest pull requests from the team',
          projectId: 1,
          priority: 1,
          status: 'pending',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'Setup development environment',
          description: 'Install required tools and dependencies',
          projectId: 1,
          priority: 0,
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        },
      ];
      set({ tasks: sampleTasks });
    }
  },

  createTask: async (task) => {
    try {
      const newTask = await window.electronAPI.createTask(task);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
      }));
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  },

  updateTask: async (id, updates) => {
    try {
      const updatedTask = await window.electronAPI.updateTask(id, updates);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTask : task
        ),
        selectedTask: state.selectedTask?.id === id ? updatedTask : state.selectedTask,
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  },

  deleteTask: async (id) => {
    try {
      await window.electronAPI.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
      }));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  },

  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },

  setFilter: (filter) => {
    set((state) => ({
      filter: { ...state.filter, ...filter },
    }));
  },

  getFilteredTasks: () => {
    const { tasks, filter } = get();
    
    return tasks.filter((task) => {
      // Status filter
      if (filter.status !== 'all' && task.status !== filter.status) {
        return false;
      }
      
      // Priority filter
      if (filter.priority !== 'all' && task.priority.toString() !== filter.priority) {
        return false;
      }
      
      // Project filter
      if (filter.projectId !== null && task.projectId !== filter.projectId) {
        return false;
      }
      
      // Search filter
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });  },
}));
