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
      className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <CheckCircle2 className="w-5 h-5 text-[#58A700] shrink-0" />;
          let borderClass = 'border-2 border-[#58CC02] bg-[#DBF8C5] text-[#3C3C3C]';

          if (toast.type === 'xp') {
            icon = <Zap className="w-5 h-5 text-[#FFC800] fill-[#FFC800] shrink-0" />;
            borderClass = 'border-2 border-[#FFE885] bg-[#FFFBE6] text-[#3C3C3C]';
          } else if (toast.type === 'streak') {
            icon = <Flame className="w-5 h-5 text-[#FF9600] fill-[#FF9600] shrink-0" />;
            borderClass = 'border-2 border-[#FFD9A6] bg-[#FFF5E6] text-[#3C3C3C]';
          } else if (toast.type === 'info') {
            icon = <Info className="w-5 h-5 text-[#1CB0F6] shrink-0" />;
            borderClass = 'border-2 border-[#BEE3F8] bg-[#EBF8FF] text-[#3C3C3C]';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
              id={`toast-item-${toast.id}`}
              className={`pointer-events-auto rounded-[16px] p-3.5 shadow-lg border-b-4 flex items-start gap-3 ${borderClass}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm leading-tight flex items-center justify-between">
                  <span>{toast.title}</span>
                  {toast.xpAmount && (
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white border border-[#FFE885] text-[#CC9900]">
                      +{toast.xpAmount} XP
                    </span>
                  )}
                </div>
                {toast.message && (
                  <p className="text-xs text-[#777777] font-semibold mt-1 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => onDismiss(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded-full text-current cursor-pointer"
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
