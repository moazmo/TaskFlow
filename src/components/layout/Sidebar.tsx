import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FolderOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Settings
} from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import { ProjectList } from '../project/ProjectList';
import { AddProjectDialog } from '../project/AddProjectDialog';
import { SettingsDialog } from '../SettingsDialog';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed } = useThemeStore();
  const { projects } = useProjectStore();
  const { filter, setFilter, tasks } = useTaskStore();
  const [showAddProject, setShowAddProject] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getTaskCount = (filterType: string, value?: any) => {
    return tasks.filter(task => {
      switch (filterType) {
        case 'all':
          return true;
        case 'today':
          const today = new Date().toISOString().split('T')[0];
          return task.dueDate?.startsWith(today);
        case 'completed':
          return task.status === 'completed';
        case 'pending':
          return task.status === 'pending';
        case 'project':
          return task.projectId === value;
        default:
          return false;
      }
    }).length;
  };

  const menuItems = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: FolderOpen,
      count: getTaskCount('all'),
      onClick: () => setFilter({ status: 'all', projectId: null })
    },
    {
      id: 'today',
      label: 'Today',
      icon: Calendar,
      count: getTaskCount('today'),
      onClick: () => setFilter({ status: 'all', projectId: null }) // TODO: Add date filter
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      count: getTaskCount('pending'),
      onClick: () => setFilter({ status: 'pending', projectId: null })
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: getTaskCount('completed'),
      onClick: () => setFilter({ status: 'completed', projectId: null })
    }
  ];
  if (sidebarCollapsed) {
    return (
      <div className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
            title={item.label}
          >
            <item.icon size={18} />
            {item.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects</h3>
            <button
              onClick={() => setShowAddProject(true)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <ProjectList />
        </div>
      </div>      {/* Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>

      <AddProjectDialog 
        open={showAddProject} 
        onOpenChange={setShowAddProject} 
      />
      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </div>
  );
};
