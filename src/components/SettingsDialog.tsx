import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Download, 
  Upload,
  Trash2,
  Info,
  Keyboard
} from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useTaskStore } from '../stores/taskStore';
import { useProjectStore } from '../stores/projectStore';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { theme, setTheme } = useThemeStore();
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'shortcuts' | 'about'>('general');

  const handleExportData = () => {
    const data = {
      tasks,
      projects,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        console.log('Import data:', data);
        // Here you would implement the import logic
        alert('Import functionality would restore your data here');
      } catch (error) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Here you would implement the clear data logic
      alert('Clear data functionality would remove all tasks and projects');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'data', label: 'Data', icon: Download },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'about', label: 'About', icon: Info },
  ];

  const shortcuts = [
    { keys: 'Ctrl + N', description: 'Create new task' },
    { keys: 'Ctrl + Shift + P', description: 'Create new project' },
    { keys: 'Ctrl + B', description: 'Toggle sidebar' },
    { keys: 'Ctrl + T', description: 'Toggle theme' },
    { keys: 'Ctrl + 1', description: 'View all tasks' },
    { keys: 'Ctrl + 2', description: 'View pending tasks' },
    { keys: 'Ctrl + 3', description: 'View completed tasks' },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-full max-w-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">Settings</Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Appearance</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor },
                        ].map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => setTheme(option.value as any)}
                              className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                                theme === option.value
                                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <IconComponent size={20} className="mb-1" />
                              <span className="text-xs">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Data Management</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">Export Data</span>
                          <button
                            onClick={handleExportData}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            <Download size={14} />
                            <span>Export</span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Download a backup of all your tasks and projects
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">Import Data</span>
                          <label className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 cursor-pointer">
                            <Upload size={14} />
                            <span>Import</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportData}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Restore data from a backup file
                        </p>
                      </div>

                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-red-700 dark:text-red-400">Clear All Data</span>
                          <button
                            onClick={handleClearAllData}
                            className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            <Trash2 size={14} />
                            <span>Clear</span>
                          </button>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Permanently delete all tasks and projects
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shortcuts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                          <span className="text-sm text-gray-900 dark:text-white">{shortcut.description}</span>
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-mono">
                            {shortcut.keys}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">About TaskFlow</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📋</div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">TaskFlow</h4>
                        <p className="text-gray-600 dark:text-gray-400">Modern Task Management</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Version 1.0.0</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{projects.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        <p>Built with Electron, React, TypeScript, and Tailwind CSS</p>
                        <p className="mt-2">© 2025 TaskFlow. All rights reserved.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
