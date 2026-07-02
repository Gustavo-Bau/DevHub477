import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ToastContext = createContext(null);
let toastId = 0;

function ToastItem({ toast, onRemove }) {
  const { id, type, title, message, duration } = toast;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = current - step;
        return next > 0 ? next : 0;
      });
    }, interval);

    const timeout = window.setTimeout(() => onRemove(id), duration);
    return () => {
      window.clearInterval(timeout);
      window.clearInterval(interval);
    };
  }, [duration, id, onRemove]);

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <div className="toast-content">
        <div>
          {title && <strong>{title}</strong>}
          <p>{message}</p>
        </div>
        <button type="button" className="toast-close" onClick={() => onRemove(id)} aria-label="Fechar notificação">
          ×
        </button>
      </div>
      <div className="toast-progress" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title = '', message = '', duration = 4500 }) => {
    const id = `toast-${toastId += 1}`;
    setToasts((current) => [{ id, type, title, message, duration }, ...current]);
  }, []);

  const value = useMemo(() => ({ toast: addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return context;
};
