import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'splash';
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  return {
    subscribe,
    add: (message: string, type: Toast['type'] = 'info', duration = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, message, type, duration };
      
      update(toasts => [...toasts, toast]);
      
      if (duration > 0) {
        setTimeout(() => {
          update(toasts => toasts.filter(t => t.id !== id));
        }, duration);
      }
      
      return id;
    },
    remove: (id: string) => {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    clear: () => {
      update(() => []);
    }
  };
}

export const toasts = createToastStore();

// Helper functions for common toast types
export const showSuccess = (message: string) => toasts.add(message, 'success');
export const showError = (message: string) => toasts.add(message, 'error');
export const showInfo = (message: string) => toasts.add(message, 'info');
export const showSplash = (message: string) => toasts.add(message, 'splash');
