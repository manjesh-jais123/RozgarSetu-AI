import { useState, ReactNode } from 'react';
import { ToastContext } from './ToastContext';
import type { Toast } from './ToastContext';

export { ToastContext };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-80 p-4 rounded-lg shadow-lg text-sm
              ${toast.type === 'success' ? 'bg-green-50 text-green-800' : ''}
              ${toast.type === 'error' ? 'bg-red-50 text-red-800' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-50 text-yellow-800' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 text-blue-800' : ''}
            `}
          >
            <p className="font-medium">{toast.title}</p>
            {toast.message && <p className="mt-1 opacity-90">{toast.message}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}