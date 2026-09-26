import React, { useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  className?: string;
}

/**
 * Interactive Code Editor component following CosePath design standards.
 * - Background: #F7F7F7
 * - Border: 2px solid #E5E5E5 (focus: #1CB0F6)
 * - Radius: 16px
 * - Font: JetBrains Mono (14px desktop / 13px mobile), line-height 1.6
 * - Pre-wrap & word-break enabled (no horizontal scrolling!)
 * - Strictly LTR always
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  placeholder = 'Write your code here...',
  disabled = false,
  minHeight = '180px',
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Handle Tab key insertion (inserts 2 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + '  ' + val.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div
      dir="ltr"
      className={`relative rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] focus-within:border-[#1CB0F6] focus-within:ring-4 focus-within:ring-[#1CB0F6]/20 transition-all overflow-hidden text-left ${className}`}
      style={{ direction: 'ltr', textAlign: 'left' }}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#F0F0F0]/60 border-b border-[#E5E5E5] text-[11px] font-extrabold uppercase tracking-wider text-[#AFAFAF]">
        <span>{language} EDITOR</span>
        <span className="text-[10px] text-[#777777] font-semibold lowercase">tab: 2 spaces</span>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex p-3 sm:p-4 text-[13px] sm:text-[14px] leading-[1.6] font-mono">
        {/* Left gutter Line Numbers */}
        <div
          className="hidden sm:flex flex-col pr-3 mr-3 border-r border-[#E5E5E5] text-right select-none text-[#AFAFAF] text-[12px] shrink-0"
          style={{ minWidth: '24px' }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <span key={i + 1}>{i + 1}</span>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 w-full bg-transparent font-mono text-[#3C3C3C] text-[13px] sm:text-[14px] leading-[1.6] border-none outline-none resize-y text-left caret-[#1CB0F6]"
          style={{
            minHeight,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            direction: 'ltr',
            textAlign: 'left',
          }}
        />
      </div>
    </div>
  );
};
