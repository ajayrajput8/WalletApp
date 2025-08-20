'use client';

import { toast as sonnerToast } from 'sonner';
import * as React from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const toast = React.useCallback(
    ({ title, description, type = 'info', duration = 4000 }: ToastOptions) => {
      switch (type) {
        case 'success':
          sonnerToast.success(description || title || 'Success', { duration });
          break;
        case 'error':
          sonnerToast.error(description || title || 'Error', { duration });
          break;
        case 'warning':
          sonnerToast.warning(description || title || 'Warning', { duration });
          break;
        default:
          sonnerToast(description || title || '');
      }
    },
    []
  );

  return { toast };
}
