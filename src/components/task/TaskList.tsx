import React from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskCard } from './TaskCard';

export const TaskList: React.FC = () => {
  const { getFilteredTasks } = useTaskStore();
  const tasks = getFilteredTasks();
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No tasks found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
