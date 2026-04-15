'use client';

import { ToastContext, type Toast } from '@/lib/toastContext';
import { useContext, useEffect, useState } from 'react';

function ToastItem({ id, type, message }: Toast) {
  const { removeToast } = useContext(ToastContext)!;

  useEffect(() => {
    // Auto-remove on unmount if needed
  }, [id]);

  const colors = {
    success: 'bg-green-600 text-white border-green-500',
    error: 'bg-red-600 text-white border-red-500',
    info: 'bg-blue-600 text-white border-blue-500',
    warning: 'bg-yellow-600 text-white border-yellow-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${colors[type]}`}
      role="alert"
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => removeToast(id)}
        className="ml-2 font-bold hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts } = context;

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} />
        </div>
      ))}
    </div>
  );
}
