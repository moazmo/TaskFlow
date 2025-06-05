import { Task, Project } from './index';

declare global {
  interface Window {
    electronAPI: {
      // Task operations
      getTasks: () => Promise<Task[]>;
      createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
      updateTask: (id: number, updates: Partial<Task>) => Promise<Task>;
      deleteTask: (id: number) => Promise<void>;
      
      // Project operations
      getProjects: () => Promise<Project[]>;
      createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
      updateProject: (id: number, updates: Partial<Project>) => Promise<Project>;
      deleteProject: (id: number) => Promise<void>;
      
      // Window controls
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      
      // Utility
      test: () => string;
    };
  }
}

export {};
