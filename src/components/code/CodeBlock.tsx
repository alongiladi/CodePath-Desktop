import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  highlightLines?: number[];
  onLineClick?: (lineNum: number) => void;
  selectedLine?: number | null;
}

/**
 * Playful syntax highlighter for Python / JS / TS snippets.
 * Renders tokens using Duolingo-inspired color system:
 * - Keywords: #CE82FF (Purple)
 * - Strings: #58A700 (Green)
 * - Numbers: #FF9600 (Orange)
 * - Comments: #AFAFAF (Gray Italic)
 * - Built-ins / Functions: #1CB0F6 (Blue)
 * - Operators: #FF4B4B (Red)
 * - Types: #FFC800 (Yellow)
 */
function renderHighlightedCode(rawCode: string) {
  const lines = rawCode.split('\n');

  return lines.map((line, lineIdx) => {
    // Basic regex tokenizer
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Match comments (# or //)
    const commentMatch = remaining.match(/(#|\/\/).*$/);
    let commentPart = '';
    if (commentMatch && commentMatch.index !== undefined) {
      commentPart = remaining.slice(commentMatch.index);
      remaining = remaining.slice(0, commentMatch.index);
    }

    // Tokenize remaining line
    const tokenRegex = /(".*?"|'.*?'|`.*?`|\b(?:def|function|class|return|if|else|elif|while|for|in|import|from|as|const|let|var|try|except|finally|raise|throw|async|await|break|continue|pass|True|False|None|true|false|null)\b|\b(?:console|print|len|range|str|int|float|list|dict|set|Math|Array|Object|JSON|Promise)\b|\b\d+\b|[+\-*/%=<>!&|^~:]+|[a-zA-Z_]\w*|[^\s\w]+|\s+)/g;
    
    let match;
    while ((match = tokenRegex.exec(remaining)) !== null) {
      const token = match[0];
      const key = `${lineIdx}-${keyIdx++}`;

      if (/^(".*?"|'.*?'|`.*?`)$/.test(token)) {
        // String
        parts.push(<span key={key} style={{ color: '#58A700' }}>{token}</span>);
      } else if (/^(def|function|class|return|if|else|elif|while|for|in|import|from|as|const|let|var|try|except|finally|raise|throw|async|await|break|continue|pass|True|False|None|true|false|null)$/.test(token)) {
        // Keyword
        parts.push(<span key={key} style={{ color: '#CE82FF', fontWeight: 700 }}>{token}</span>);
      } else if (/^(console|print|len|range|str|int|float|list|dict|set|Math|Array|Object|JSON|Promise)$/.test(token)) {
        // Built-in / Function
        parts.push(<span key={key} style={{ color: '#1CB0F6', fontWeight: 600 }}>{token}</span>);
      } else if (/^\d+$/.test(token)) {
        // Number
        parts.push(<span key={key} style={{ color: '#FF9600' }}>{token}</span>);
      } else if (/^[+\-*/%=<>!&|^~:]+$/.test(token)) {
        // Operator
        parts.push(<span key={key} style={{ color: '#FF4B4B' }}>{token}</span>);
      } else {
        // Identifier / whitespace / punctuation
        parts.push(<span key={key} style={{ color: '#3C3C3C' }}>{token}</span>);
      }
    }

    if (commentPart) {
      parts.push(
        <span key={`comm-${lineIdx}`} style={{ color: '#AFAFAF', fontStyle: 'italic' }}>
          {commentPart}
        </span>
      );
    }

    return (
      <span key={`line-${lineIdx}`} className="block">
        {parts.length > 0 ? parts : '\u00A0'}
      </span>
    );
  });
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  showLineNumbers = true,
  className = '',
  highlightLines = [],
  onLineClick,
  selectedLine,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 800);
  };

  const lineCount = code.split('\n').length;

  return (
    <div
      dir="ltr"
      className={`relative group rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] text-left overflow-hidden ${className}`}
      style={{ direction: 'ltr', textAlign: 'left' }}
    >
      {/* Header bar: Language Tag + Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#F0F0F0]/70 border-b border-[#E5E5E5] text-xs">
        <span className="font-extrabold uppercase tracking-wider text-[11px] text-[#AFAFAF]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
            copied
              ? 'bg-[#58CC02] text-white shadow-xs'
              : 'text-[#777777] hover:text-[#3C3C3C] hover:bg-[#E5E5E5]/60'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with pre-wrap and line numbers */}
      <div className="flex p-3 sm:p-4 text-[13px] sm:text-[14px] leading-[1.6] font-mono overflow-x-hidden">
        {showLineNumbers && (
          <div
            className="hidden sm:flex flex-col pr-3 mr-3 border-r border-[#E5E5E5] text-right select-none text-[#AFAFAF] shrink-0 text-[12px]"
            style={{ minWidth: '24px' }}
          >
            {Array.from({ length: lineCount }).map((_, i) => {
              const lineNum = i + 1;
              const isSelected = selectedLine === lineNum;
              return (
                <span
                  key={lineNum}
                  onClick={() => onLineClick?.(lineNum)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'text-[#58CC02] font-bold' : 'hover:text-[#3C3C3C]'
                  }`}
                >
                  {lineNum}
                </span>
              );
            })}
          </div>
        )}

        {/* Code Content */}
        <pre
          className="flex-1 font-mono text-[#3C3C3C] overflow-x-hidden text-left"
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            direction: 'ltr',
            textAlign: 'left',
          }}
        >
          {renderHighlightedCode(code)}
        </pre>
      </div>
    </div>
  );
};
