// src/components/ui/Toast.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const ToastCtx = createContext(null);
export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }) {
  const [queue, setQueue] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = crypto.randomUUID();
    setQueue((q) => [...q, { id, message, type }]);
    setTimeout(() => {
      setQueue((q) => q.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="agc-toast-wrap">
        {queue.map((t) => (
          <div key={t.id} className={`agc-toast agc-toast--${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
