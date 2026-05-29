import React, { useState, useEffect, useCallback } from 'react';

/**
 * Hook et composant pour les notifications Toast.
 */
let toastListener = null;

export const showToast = (message, type = 'success') => {
  if (toastListener) toastListener(message, type);
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = (message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };
    return () => { toastListener = null; };
  }, []);

  const icon = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{icon[t.type] || '📢'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
