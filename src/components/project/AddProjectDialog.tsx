import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, FolderOpen } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ open, onOpenChange }) => {
  const { createProject } = useProjectStore();
  
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    await createProject({
      name: formData.name.trim(),
      color: formData.color,
    });
    
    // Reset form
    setFormData({
      name: '',
      color: '#3b82f6',
    });
    
    onOpenChange(false);
  };

  const colorOptions = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#f97316', // Orange
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#ec4899', // Pink
    '#6b7280', // Gray
  ];

  return (    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-full max-w-md z-50">          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">Add New Project</Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
              <X size={16} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <FolderOpen className="inline mr-1" size={14} />
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Color</label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color 
                        ? 'border-blue-600 scale-110' 
                        : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm text-gray-900 dark:text-white">
                {formData.name || 'Project Name'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
