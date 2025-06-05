import React, { createContext, useContext, useState } from 'react';
import { Task } from '../types';

interface DragDropContextType {
  draggedTask: Task | null;
  isDragging: boolean;
  setDraggedTask: (task: Task | null) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragDropContext.Provider value={{
      draggedTask,
      isDragging,
      setDraggedTask,
      setIsDragging,
    }}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};
