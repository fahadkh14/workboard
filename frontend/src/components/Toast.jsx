import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="card wb-animate-in flex items-center gap-2.5 px-4 py-3 shadow-elevated min-w-[260px]"
          >
            {t.type === "success" ? (
              <CheckCircle2 size={18} style={{ color: "var(--wb-success)" }} />
            ) : (
              <XCircle size={18} style={{ color: "var(--wb-danger)" }} />
            )}
            <span className="text-sm text-text flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-muted hover:text-text">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
