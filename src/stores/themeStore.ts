import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  
  // Actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  sidebarCollapsed: false,

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      return { theme: newTheme };
    });
  },

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    set({ theme });
  },

  toggleSidebar: () => {
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },
}));
