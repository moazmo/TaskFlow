import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after duration (default 5 seconds)
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
    }}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onRemove={onRemove} 
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-lg border ${getBgColor()} shadow-lg max-w-sm animate-in slide-in-from-right duration-300`}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notification.message}
          </p>
        )}
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
