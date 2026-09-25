import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'indigo' | 'emerald' | 'amber' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  id?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'indigo',
  size = 'md',
  showLabel = false,
  className = '',
  id,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorClasses = {
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    blue: 'bg-sky-500 dark:bg-sky-400',
  };

  return (
    <div id={id} className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
