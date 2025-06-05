import { contextBridge, ipcRenderer } from 'electron';
import { Task, Project } from './types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Task operations
  getTasks: () => ipcRenderer.invoke('db:getTasks'),
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => 
    ipcRenderer.invoke('db:createTask', task),
  updateTask: (id: number, updates: Partial<Task>) => 
    ipcRenderer.invoke('db:updateTask', id, updates),
  deleteTask: (id: number) => ipcRenderer.invoke('db:deleteTask', id),

  // Project operations
  getProjects: () => ipcRenderer.invoke('db:getProjects'),
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => 
    ipcRenderer.invoke('db:createProject', project),
  updateProject: (id: number, updates: Partial<Project>) => 
    ipcRenderer.invoke('db:updateProject', id, updates),
  deleteProject: (id: number) => ipcRenderer.invoke('db:deleteProject', id),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('app:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('app:maximize'),
  closeWindow: () => ipcRenderer.invoke('app:close'),

  // Utility
  test: () => 'Electron API working'
});
