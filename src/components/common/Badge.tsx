import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'outline' | 'purple' | 'streak';
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  id,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    primary: 'bg-[#1CB0F6]/10 text-[#1CB0F6] border border-[#1CB0F6]/30',
    purple: 'bg-[#CE82FF]/10 text-[#CE82FF] border border-[#CE82FF]/30',
    success: 'bg-[#DBF8C5] text-[#58A700] border border-[#58CC02]/30',
    warning: 'bg-[#FFC800]/15 text-[#CC7A00] border border-[#FFC800]/40',
    streak: 'bg-[#FF9600]/15 text-[#CC7A00] border border-[#FF9600]/40',
    neutral: 'bg-[#F7F7F7] text-[#777777] border border-[#E5E5E5]',
    outline: 'bg-white text-[#777777] border-2 border-[#E5E5E5]',
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 rounded-full font-extrabold whitespace-nowrap uppercase tracking-wider ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
