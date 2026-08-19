"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type AlertType = "success" | "error" | "info" | "warning";

const colors = {
  components: {
    toast: {
      success: {
        bg: "#f0fdf4", // Tailwind green-50
        border: "#bbf7d0", // Tailwind green-200
        icon: "#16a34a", // Tailwind green-600
      },
      error: {
        bg: "#fef2f2", // Tailwind red-50
        border: "#fecaca", // Tailwind red-200
        icon: "#dc2626", // Tailwind red-600
      },
      warning: {
        bg: "#fffbeb", // Tailwind amber-50
        border: "#fde68a", // Tailwind amber-200
        icon: "#d97706", // Tailwind amber-600
      },
      info: {
        bg: "#eff6ff", // Tailwind blue-50
        border: "#bfdbfe", // Tailwind blue-200
        icon: "#2563eb", // Tailwind blue-600
      },
    },
  },
  text: {
    success: "#166534", // Tailwind green-800
    error: "#991b1b", // Tailwind red-800
    warning: "#92400e", // Tailwind amber-800
    info: "#1e40af", // Tailwind blue-800
  },
};

interface Toast {
  id: string;
  type: AlertType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string, duration?: number) => void;
    error: (title: string, description?: string, duration?: number) => void;
    info: (title: string, description?: string, duration?: number) => void;
    warning: (title: string, description?: string, duration?: number) => void;
    show: (type: AlertType, title: string, description?: string, duration?: number) => void;
  };
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type: AlertType, title: string, description = "", duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toastHelpers = {
    success: (title: string, description = "", duration?: number) => show("success", title, description, duration),
    error: (title: string, description = "", duration?: number) => show("error", title, description, duration),
    info: (title: string, description = "", duration?: number) => show("info", title, description, duration),
    warning: (title: string, description = "", duration?: number) => show("warning", title, description, duration),
    show,
  };

  return (
    <ToastContext.Provider value={{ toast: toastHelpers, toasts, removeToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[360px] z-50 flex flex-col gap-3">
        <style>{`
          @keyframes toast-progress-bar {
            from { width: 0%; }
            to { width: 100%; }
          }
          .animate-toast-progress {
            animation: toast-progress-bar linear forwards;
          }
          @keyframes toast-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-toast-slide-in {
            animation: toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
        {toasts.map((t) => {
          const toastColors = colors.components.toast[t.type];
          const textCol = colors.text[t.type];

          const getIcon = () => {
            switch (t.type) {
              case "success":
                return (
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: toastColors.icon }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                );
              case "error":
                return (
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: toastColors.icon }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                );
              case "info":
                return (
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: toastColors.icon }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                );
              case "warning":
                return (
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: toastColors.icon }}>
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                );
            }
          };

          return (
            <div
              key={t.id}
              className="animate-toast-slide-in transition-all duration-300 transform scale-100 opacity-100 hover:scale-[1.01]"
            >
              <div
                className="relative flex items-start gap-3 rounded-lg p-4 shadow-md border overflow-hidden transition-all duration-200 pb-5"
                role="alert"
                style={{
                  backgroundColor: toastColors.bg,
                  borderColor: toastColors.border,
                }}
              >
                {/* Icon */}
                <span className="mt-0.5">{getIcon()}</span>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-0.5" style={{ color: textCol }}>
                  <h5 className="font-bold text-sm leading-tight tracking-wide">{t.title}</h5>
                  {t.description && (
                    <p className="text-xs opacity-90 leading-relaxed font-medium">{t.description}</p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="ml-2 rounded p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                  style={{ color: textCol }}
                  aria-label="Close notification"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Progress Bar Timer */}
                {t.duration && t.duration > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-[4px] overflow-hidden bg-black/5">
                    <div
                      className="h-full origin-left animate-toast-progress"
                      style={{
                        backgroundColor: toastColors.icon,
                        animationDuration: `${t.duration}ms`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}