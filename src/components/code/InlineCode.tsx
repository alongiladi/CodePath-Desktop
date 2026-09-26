import React from 'react';

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Inline code snippet inside body text.
 * Styled in Duolingo purple (#CE82FF), #F7F7F7 background, 1px #E5E5E5 border, 6px radius.
 * ALWAYS strictly LTR regardless of UI language.
 */
export const InlineCode: React.FC<InlineCodeProps> = ({ children, className = '' }) => {
  return (
    <code
      dir="ltr"
      className={`inline-block font-mono text-[13px] sm:text-[14px] font-semibold text-[#CE82FF] bg-[#F7F7F7] border border-[#E5E5E5] rounded-[6px] px-1.5 py-0.5 align-baseline text-left ${className}`}
    >
      {children}
    </code>
  );
};
