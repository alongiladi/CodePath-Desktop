import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastMessage } from '../../types';
import { CheckCircle2, Zap, Flame, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          let borderClass = 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100';

          if (toast.type === 'xp') {
            icon = <Zap className="w-5 h-5 text-indigo-500 shrink-0 fill-indigo-400/40" />;
            borderClass = 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/95 dark:bg-indigo-950/90 text-indigo-950 dark:text-indigo-100';
          } else if (toast.type === 'streak') {
            icon = <Flame className="w-5 h-5 text-amber-500 shrink-0 fill-amber-400/40" />;
            borderClass = 'border-amber-200 dark:border-amber-900/60 bg-amber-50/95 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100';
          } else if (toast.type === 'info') {
            icon = <Info className="w-5 h-5 text-slate-500 shrink-0" />;
            borderClass = 'border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              id={`toast-item-${toast.id}`}
              className={`pointer-events-auto rounded-xl p-3.5 border shadow-lg backdrop-blur-md flex items-start gap-3 ${borderClass}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight flex items-center justify-between">
                  <span>{toast.title}</span>
                  {toast.xpAmount && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                      +{toast.xpAmount} XP
                    </span>
                  )}
                </div>
                {toast.message && (
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => onDismiss(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded text-current"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
