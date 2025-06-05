import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';

export const ProjectList: React.FC = () => {
  const { projects } = useProjectStore();
  const { setFilter, tasks } = useTaskStore();

  const getProjectTaskCount = (projectId: number) => {
    return tasks.filter(task => task.projectId === projectId && task.status !== 'completed').length;
  };

  const handleProjectClick = (projectId: number) => {
    setFilter({ projectId, status: 'all' });
  };

  return (
    <div className="space-y-1">
      {projects.map((project) => (        <button
          key={project.id}
          onClick={() => handleProjectClick(project.id!)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="text-sm font-medium truncate">{project.name}</span>
          </div>
          {getProjectTaskCount(project.id!) > 0 && (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full flex-shrink-0">
              {getProjectTaskCount(project.id!)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
