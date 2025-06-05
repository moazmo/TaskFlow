import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !!event.ctrlKey === !!shortcut.ctrlKey;
        const altMatches = !!event.altKey === !!shortcut.altKey;
        const shiftMatches = !!event.shiftKey === !!shortcut.shiftKey;
        
        return keyMatches && ctrlMatches && altMatches && shiftMatches;
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return shortcuts;
};
