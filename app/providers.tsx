'use client';

import { ToastProvider } from '@/lib/toastContext';
import { ToastContainer } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
