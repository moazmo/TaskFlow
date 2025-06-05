import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  X, 
  Calendar, 
  Flag, 
  FolderOpen, 
  Clock, 
  CheckCircle2, 
  Circle,
  Trash2,
  Edit3
} from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useProjectStore } from '../../stores/projectStore';
import { EditTaskDialog } from './EditTaskDialog';

export const TaskDetail: React.FC = () => {
  const { selectedTask, setSelectedTask, updateTask, deleteTask } = useTaskStore();
  const { projects } = useProjectStore();
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!selectedTask) return null;

  const project = projects.find(p => p.id === selectedTask.projectId);
  const priorityColors: { [key: number]: string } = {
    0: 'text-gray-500',
    1: 'text-blue-500',
    2: 'text-orange-500',
    3: 'text-red-500',
  };

  const priorityLabels: { [key: number]: string } = {
    0: 'Low',
    1: 'Medium',
    2: 'High',
    3: 'Urgent',
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Circle },
    { value: 'in_progress', label: 'In Progress', icon: Clock },
    { value: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  const handleStatusChange = (status: 'pending' | 'in_progress' | 'completed') => {
    updateTask(selectedTask.id!, { status });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(selectedTask.id!);
      setSelectedTask(null);
    }
  };

  const isOverdue = selectedTask.dueDate && new Date(selectedTask.dueDate) < new Date() && selectedTask.status !== 'completed';
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white">Task Details</h2>        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowEditDialog(true)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 rounded text-gray-600 dark:text-gray-400"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => setSelectedTask(null)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">        {/* Title */}
        <div>
          <h3 className={`text-lg font-medium ${selectedTask.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {selectedTask.title}
          </h3>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Status</label>
          <div className="space-y-2">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value as any)}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
                    selectedTask.status === option.value
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>        {/* Description */}
        {selectedTask.description && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Description</label>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {selectedTask.description}
            </p>
          </div>
        )}

        {/* Project */}
        {project && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              <FolderOpen className="inline mr-1" size={14} />
              Project
            </label>
            <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-sm text-gray-900 dark:text-white">{project.name}</span>
            </div>
          </div>
        )}

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            <Flag className="inline mr-1" size={14} />
            Priority
          </label>
          <div className={`flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${priorityColors[selectedTask.priority]}`}>
            <Flag size={16} />
            <span className="text-sm">{priorityLabels[selectedTask.priority]}</span>
          </div>
        </div>        {/* Due Date */}
        {selectedTask.dueDate && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              <Calendar className="inline mr-1" size={14} />
              Due Date
            </label>
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${
              isOverdue ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              <Calendar size={16} />
              <span className="text-sm">
                {format(new Date(selectedTask.dueDate), 'EEEE, MMMM dd, yyyy')}
              </span>
              {isOverdue && (
                <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                  Overdue
                </span>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-medium">Created:</span> {' '}
            {selectedTask.createdAt && format(new Date(selectedTask.createdAt), 'MMM dd, yyyy HH:mm')}
          </div>
          {selectedTask.updatedAt && selectedTask.updatedAt !== selectedTask.createdAt && (
            <div>
              <span className="font-medium">Updated:</span> {' '}
              {format(new Date(selectedTask.updatedAt), 'MMM dd, yyyy HH:mm')}
            </div>
          )}
          {selectedTask.completedAt && (
            <div>
              <span className="font-medium">Completed:</span> {' '}
              {format(new Date(selectedTask.completedAt), 'MMM dd, yyyy HH:mm')}
            </div>
          )}        </div>
      </div>
      
      <EditTaskDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        task={selectedTask}
      />
    </div>
  );
};
