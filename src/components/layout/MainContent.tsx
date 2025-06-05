import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { TaskList } from '../task/TaskList';
import { TaskDetail } from '../task/TaskDetail';
import { AddTaskDialog } from '../task/AddTaskDialog';
import { useTaskStore } from '../../stores/taskStore';

export const MainContent: React.FC = () => {
  const { selectedTask, filter, setFilter } = useTaskStore();
  const [showAddTask, setShowAddTask] = useState(false);

  const priorityFilters = [
    { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
    { value: '0', label: 'Low', color: 'bg-gray-100 text-gray-600' },
    { value: '1', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
    { value: '2', label: 'High', color: 'bg-orange-100 text-orange-700' },
    { value: '3', label: 'Urgent', color: 'bg-red-100 text-red-700' },
  ];

  return (    <div className="flex-1 flex overflow-hidden">      {/* Task List */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Tasks</h1>
            
            {/* Priority Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <div className="flex space-x-1">
                {priorityFilters.map((priorityFilter) => (
                  <button
                    key={priorityFilter.value}
                    onClick={() => setFilter({ priority: priorityFilter.value as any })}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      filter.priority === priorityFilter.value
                        ? priorityFilter.color
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {priorityFilter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
        
        <TaskList />
      </div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <div className="w-80 border-l border-gray-200 dark:border-gray-700">
          <TaskDetail />
        </div>
      )}

      <AddTaskDialog 
        open={showAddTask} 
        onOpenChange={setShowAddTask} 
      />
    </div>
  );
};
