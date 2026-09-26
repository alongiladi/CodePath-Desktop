import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'green' | 'indigo' | 'orange' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  id?: string;
}

/**
 * CosePath Duolingo-style Progress Bar
 * Height: 12-16px, Track: #E5E5E5, Radius: 9999px (pill)
 * Fill: #58CC02 (Green) / #FF9600 (Streak Orange)
 * Fill animation: 320ms ease-out
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'green',
  size = 'md',
  showLabel = false,
  className = '',
  id,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-2.5',
    md: 'h-4',
    lg: 'h-5',
  };

  const colorStyles = {
    green: { bg: '#58CC02', highlight: '#89E219' },
    indigo: { bg: '#1CB0F6', highlight: '#70D6FF' },
    orange: { bg: '#FF9600', highlight: '#FFB84D' },
    yellow: { bg: '#FFC800', highlight: '#FFE066' },
    red: { bg: '#FF4B4B', highlight: '#FF8080' },
  }[color] || { bg: '#58CC02', highlight: '#89E219' };

  return (
    <div id={id} className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-extrabold text-[#777777] mb-1.5">
          <span className="uppercase tracking-wider">Progress</span>
          <span className="text-[#3C3C3C]">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-[#E5E5E5] p-0.5 overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} rounded-full transition-all duration-300 ease-out relative`}
          style={{
            width: `${clamped}%`,
            backgroundColor: colorStyles.bg,
          }}
        >
          {/* Subtle top pill reflection shine */}
          {clamped > 5 && (
            <div
              className="absolute top-0.5 left-2 right-2 h-1 rounded-full opacity-40"
              style={{ backgroundColor: colorStyles.highlight }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
