import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Flag, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle,
  Clock
} from 'lucide-react';
import { Task } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { useProjectStore } from '../../stores/projectStore';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, setSelectedTask, selectedTask } = useTaskStore();
  const { projects } = useProjectStore();

  const project = projects.find(p => p.id === task.projectId);
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id!.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedTaskId = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (draggedTaskId !== task.id) {
      // You could implement task reordering logic here
      console.log(`Dropped task ${draggedTaskId} onto task ${task.id}`);
    }
  };
    const priorityColors: { [key: number]: string } = {
    0: 'text-gray-400', // Low
    1: 'text-blue-500', // Medium
    2: 'text-orange-500', // High
    3: 'text-red-500', // Urgent
  };

  const priorityLabels: { [key: number]: string } = {
    0: 'Low',
    1: 'Medium', 
    2: 'High',
    3: 'Urgent',
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id!, { status: newStatus });
  };

  const handleCardClick = () => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCardClick}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm select-none
        ${selectedTask?.id === task.id 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
        }
        ${task.status === 'completed' ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Completion Toggle */}
        <button
          onClick={handleToggleComplete}
          className="mt-1 hover:scale-110 transition-transform"
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="text-green-500" size={20} />
          ) : (
            <Circle className="text-gray-400 hover:text-blue-500" size={20} />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={14} />
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Task Meta */}
          <div className="flex items-center space-x-4 mt-3">
            {/* Project */}
            {project && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{project.name}</span>
              </div>
            )}

            {/* Priority */}
            <div className="flex items-center space-x-1">
              <Flag size={12} className={priorityColors[task.priority]} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {priorityLabels[task.priority]}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                <Calendar size={12} />
                <span className="text-xs">
                  {format(new Date(task.dueDate), 'MMM dd')}
                </span>
              </div>
            )}

            {/* Status */}
            {task.status === 'in_progress' && (
              <div className="flex items-center space-x-1 text-blue-500">
                <Clock size={12} />
                <span className="text-xs">In Progress</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
