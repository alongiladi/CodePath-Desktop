import React from 'react';
import { Terminal, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ConsoleOutputProps {
  output: string;
  status?: 'idle' | 'running' | 'success' | 'warning' | 'error';
  emptyPlaceholder?: string;
  className?: string;
}

/**
 * Console / Output Panel
 * Background: #F7F7F7
 * Border: 2px solid #E5E5E5
 * Radius: 16px
 * Font: JetBrains Mono 13px, line-height 1.5
 * Output styling:
 * - Standard: #3C3C3C
 * - Error: #FF4B4B, weight 600
 * - Warning: #FF9600
 * - Info: #1CB0F6
 * - Success: #58CC02, weight 600
 * Direction: ALWAYS LTR, pre-wrap
 */
export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  output,
  status = 'idle',
  emptyPlaceholder = 'Output will appear here...',
  className = '',
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[#1CB0F6] font-bold text-[11px] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#1CB0F6]" />
            RUNNING...
          </span>
        );
      case 'success':
        return (
          <span className="flex items-center gap-1 text-[#58CC02] font-bold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SUCCESS
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[#FF9600] font-bold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            WARNING
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-[#FF4B4B] font-bold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" />
            ERROR
          </span>
        );
      default:
        return (
          <span className="text-[#AFAFAF] font-bold text-[11px]">
            CONSOLE
          </span>
        );
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'error':
        return 'text-[#FF4B4B] font-semibold';
      case 'warning':
        return 'text-[#FF9600]';
      case 'success':
        return 'text-[#3C3C3C]';
      default:
        return 'text-[#3C3C3C]';
    }
  };

  return (
    <div
      dir="ltr"
      className={`rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] overflow-hidden text-left ${className}`}
      style={{ direction: 'ltr', textAlign: 'left' }}
    >
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#F0F0F0]/60 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#777777]" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#777777]">
            TERMINAL OUTPUT
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Output Area */}
      <div className="p-3 sm:p-4 text-[13px] font-mono leading-[1.5] min-h-[100px] max-h-[220px] overflow-y-auto">
        {status === 'running' && !output && (
          <div className="flex items-center gap-2 text-[#1CB0F6] text-xs font-semibold italic">
            <span className="animate-spin text-sm">✦</span>
            Executing code...
          </div>
        )}

        {output ? (
          <pre
            className={`font-mono text-[13px] whitespace-pre-wrap break-all ${getTextColor()}`}
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              direction: 'ltr',
              textAlign: 'left',
            }}
          >
            {output}
          </pre>
        ) : status !== 'running' ? (
          <p className="text-[#AFAFAF] italic text-xs select-none">
            {emptyPlaceholder}
          </p>
        ) : null}
      </div>
    </div>
  );
};
