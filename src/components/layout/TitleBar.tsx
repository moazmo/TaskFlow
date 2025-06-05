import React from 'react';
import { Menu, Sun, Moon, Minimize2, Square, X } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

export const TitleBar: React.FC = () => {
  const { theme, toggleTheme, toggleSidebar } = useThemeStore();

  return (
    <div className="flex items-center justify-between h-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 select-none drag-region">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors no-drag"
        >
          <Menu size={14} />
        </button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">TaskFlow</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={toggleTheme}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors no-drag"
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
          <div className="flex">
          <button 
            onClick={() => window.electronAPI?.minimizeWindow()}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors no-drag"
          >
            <Minimize2 size={14} />
          </button>
          <button 
            onClick={() => window.electronAPI?.maximizeWindow()}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors no-drag"
          >
            <Square size={14} />
          </button>
          <button 
            onClick={() => window.electronAPI?.closeWindow()}
            className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors no-drag"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
