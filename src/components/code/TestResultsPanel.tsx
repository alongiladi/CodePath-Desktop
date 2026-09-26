import React from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TestCaseResult {
  id: string;
  name: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  details?: string;
}

interface TestResultsPanelProps {
  testCases: TestCaseResult[];
  summaryText?: string;
  className?: string;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  testCases,
  summaryText,
  className = '',
}) => {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  const passedCount = testCases.filter((t) => t.passed).length;
  const totalCount = testCases.length;
  const passPercent = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;
  const allPassed = passedCount === totalCount && totalCount > 0;

  let progressColor = '#58CC02'; // Green
  if (passedCount === 0) {
    progressColor = '#FF4B4B'; // Red
  } else if (passedCount < totalCount) {
    progressColor = '#FF9600'; // Orange
  }

  return (
    <div className={`cose-card p-4 sm:p-5 space-y-4 ${className}`}>
      {/* Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-[12px] bg-[#F7F7F7] border border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 className="w-5 h-5 text-[#58CC02]" />
          ) : (
            <XCircle className="w-5 h-5 text-[#FF4B4B]" />
          )}
          <span className="text-sm font-extrabold text-[#3C3C3C]">
            {summaryText || `${passedCount}/${totalCount} tests passed`}
          </span>
        </div>

        {/* Progress Bar (Pill) */}
        <div className="w-full sm:w-44 h-3 rounded-full bg-[#E5E5E5] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${passPercent}%` }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: progressColor }}
          />
        </div>
      </div>

      {/* Staggered Test Result Rows */}
      <div className="space-y-2">
        {testCases.map((tc, idx) => {
          const isExpanded = expandedRow === tc.id;
          return (
            <motion.div
              key={tc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.2 }}
              className="rounded-[12px] border border-[#E5E5E5] bg-white overflow-hidden"
            >
              <div
                onClick={() => setExpandedRow(isExpanded ? null : tc.id)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#F7F7F7] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {tc.passed ? (
                    <div className="w-5 h-5 rounded-full bg-[#DBF8C5] text-[#58A700] flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#FFE0E0] text-[#FF4B4B] flex items-center justify-center font-bold text-xs">
                      ✗
                    </div>
                  )}
                  <span className="text-sm font-semibold text-[#3C3C3C]">
                    {tc.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-[6px] ${
                      tc.passed
                        ? 'bg-[#DBF8C5] text-[#58A700]'
                        : 'bg-[#FFE0E0] text-[#FF4B4B]'
                    }`}
                  >
                    {tc.passed ? 'PASSED' : 'FAILED'}
                  </span>
                  {(tc.expected || tc.actual) && (
                    <span className="text-[#777777]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  )}
                </div>
              </div>

              {/* Expandable Expected vs Actual Diff */}
              <AnimatePresence>
                {isExpanded && (tc.expected || tc.actual) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-3 bg-[#F7F7F7] border-t border-[#E5E5E5] space-y-2 text-xs"
                  >
                    {tc.expected && (
                      <div>
                        <span className="font-bold text-[#777777] block mb-1">Expected:</span>
                        <pre
                          dir="ltr"
                          className="p-2 rounded-[8px] bg-white border border-[#E5E5E5] text-[#3C3C3C] font-mono text-[12px] whitespace-pre-wrap break-all text-left"
                        >
                          {tc.expected}
                        </pre>
                      </div>
                    )}
                    {tc.actual && (
                      <div>
                        <span className="font-bold text-[#FF4B4B] block mb-1">Actual:</span>
                        <pre
                          dir="ltr"
                          className="p-2 rounded-[8px] bg-[#FFE0E0]/40 border border-[#FF4B4B]/30 text-[#FF4B4B] font-mono text-[12px] whitespace-pre-wrap break-all text-left"
                        >
                          {tc.actual}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
