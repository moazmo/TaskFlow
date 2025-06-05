import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Flag, FolderOpen, FileText } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useProjectStore } from '../../stores/projectStore';
import { Task } from '../../types';

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({ open, onOpenChange, task }) => {
  const { updateTask } = useTaskStore();
  const { projects } = useProjectStore();
    const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 0 as 0 | 1 | 2 | 3,
    dueDate: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        projectId: task.projectId ? task.projectId.toString() : '',
        priority: task.priority as 0 | 1 | 2 | 3,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !task) return;    await updateTask(task.id!, {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      projectId: formData.projectId ? parseInt(formData.projectId) : undefined,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      status: formData.status,
      updatedAt: new Date().toISOString(),
      ...(formData.status === 'completed' && task.status !== 'completed' && {
        completedAt: new Date().toISOString()
      }),
      ...(formData.status !== 'completed' && task.status === 'completed' && {
        completedAt: undefined
      }),
    });
    
    onOpenChange(false);
  };

  const priorityOptions = [
    { value: 0, label: 'Low', color: 'text-gray-500' },
    { value: 1, label: 'Medium', color: 'text-blue-500' },
    { value: 2, label: 'High', color: 'text-orange-500' },
    { value: 3, label: 'Urgent', color: 'text-red-500' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">Edit Task</Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
              <X size={16} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <FileText className="inline mr-1" size={14} />
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <FolderOpen className="inline mr-1" size={14} />
                Project
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <Flag className="inline mr-1" size={14} />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) as any })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <Calendar className="inline mr-1" size={14} />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                Update Task
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
