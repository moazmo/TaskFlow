import React, { useEffect, useState } from 'react';
import './styles/globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { useThemeStore } from './stores/themeStore';
import { useTaskStore } from './stores/taskStore';
import { useProjectStore } from './stores/projectStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AddTaskDialog } from './components/task/AddTaskDialog';
import { AddProjectDialog } from './components/project/AddProjectDialog';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';

const AppContent: React.FC = () => {
  const { theme, sidebarCollapsed, toggleSidebar, toggleTheme } = useThemeStore();
  const { loadTasks, setFilter, tasks } = useTaskStore();
  const { loadProjects } = useProjectStore();
  const { addNotification } = useNotifications();
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  // Check for overdue tasks
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      const overdueTasks = tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) < now && 
        task.status !== 'completed'
      );

      if (overdueTasks.length > 0) {
        addNotification({
          type: 'warning',
          title: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
          message: 'You have tasks that are past their due date',
          duration: 8000,
        });
      }
    };

    // Check on app load and then every 30 minutes
    if (tasks.length > 0) {
      checkOverdueTasks();
      const interval = setInterval(checkOverdueTasks, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [tasks, addNotification]);

  // Keyboard shortcuts
  const shortcuts = useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      callback: () => setShowAddTask(true),
      description: 'Create new task',
    },
    {
      key: 'p',
      ctrlKey: true,
      shiftKey: true,
      callback: () => setShowAddProject(true),
      description: 'Create new project',
    },
    {
      key: 'b',
      ctrlKey: true,
      callback: () => toggleSidebar(),
      description: 'Toggle sidebar',
    },
    {
      key: 't',
      ctrlKey: true,
      callback: () => toggleTheme(),
      description: 'Toggle theme',
    },
    {
      key: '1',
      ctrlKey: true,
      callback: () => setFilter({ status: 'all' }),
      description: 'View all tasks',
    },
    {
      key: '2',
      ctrlKey: true,
      callback: () => setFilter({ status: 'pending' }),
      description: 'View pending tasks',
    },
    {
      key: '3',
      ctrlKey: true,
      callback: () => setFilter({ status: 'completed' }),
      description: 'View completed tasks',
    },
  ]);
  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    // Load initial data
    const initializeApp = async () => {
      try {
        await Promise.all([
          loadTasks(),
          loadProjects()
        ]);
        console.log('TaskFlow data loaded successfully');
      } catch (error) {
        console.error('Failed to initialize TaskFlow:', error);
      }
    };

    initializeApp();
  }, [loadTasks, loadProjects]);

  return (
    <ErrorBoundary>
      <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col overflow-hidden">
        <TitleBar />
        
        <div className="flex flex-1 overflow-hidden">
          {!sidebarCollapsed && <Sidebar />}
          <MainContent />
        </div>
        
        {/* Global dialogs */}
        <AddTaskDialog 
          open={showAddTask} 
          onOpenChange={setShowAddTask} 
        />
        <AddProjectDialog 
          open={showAddProject} 
          onOpenChange={setShowAddProject} 
        />
      </div>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
};

export default App;
