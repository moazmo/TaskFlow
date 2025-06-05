import { create } from 'zustand';
import { Project } from '../types/index';

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  
  // Actions
  loadProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: number, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  loadProjects: async () => {
    try {
      const projects = await window.electronAPI.getProjects();
      set({ projects });
    } catch (error) {
      console.error('Failed to load projects:', error);
      // Fallback to sample data for testing
      const sampleProjects: Project[] = [
        {
          id: 1,
          name: 'Personal Tasks',
          color: '#3b82f6',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Work Projects',
          color: '#10b981',
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'Home',
          color: '#f59e0b',
          createdAt: new Date().toISOString(),
        },
      ];
      set({ projects: sampleProjects });
    }
  },

  createProject: async (project) => {
    try {
      const newProject = await window.electronAPI.createProject(project);
      set((state) => ({
        projects: [...state.projects, newProject],
      }));
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  },

  updateProject: async (id, updates) => {
    try {
      const updatedProject = await window.electronAPI.updateProject(id, updates);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? updatedProject : project
        ),
        selectedProject: state.selectedProject?.id === id ? updatedProject : state.selectedProject,
      }));
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  },

  deleteProject: async (id) => {
    try {
      await window.electronAPI.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
      }));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  },

  setSelectedProject: (project) => {
    set({ selectedProject: project });
  },
}));
