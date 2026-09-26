import React, { useState } from 'react';
import { Lesson, UserProfile, NavScreen } from '../../types';
import { LESSONS, COURSES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { CodeBlock } from '../code/CodeBlock';
import { InlineCode } from '../code/InlineCode';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Play, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  BookOpen,
  Code2,
  ChevronRight
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface LessonViewProps {
  lessonId: string;
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onCompleteLesson: (lessonId: string, courseId?: string) => void;
  onOpenMentor: (initialPrompt?: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  user,
  onNavigate,
  onCompleteLesson,
  onOpenMentor,
}) => {
  const lesson: Lesson = LESSONS[lessonId] || LESSONS['python-13'];
  const course = COURSES.find((c) => c.id === lesson.courseId) || COURSES[0];

  const [activeStepTab, setActiveStepTab] = useState<'concept' | 'example' | 'breakdown' | 'tip'>('concept');
  const [selectedLine, setSelectedLine] = useState<number | null>(2);
  const isCompleted = user.completedLessons.includes(lesson.id);

  // Section progress calculation
  const currentLessonIndex = lesson.order;
  const sectionProgressPercent = Math.round((currentLessonIndex / (lesson.totalInCourse || 28)) * 100);

  const handleMarkComplete = () => {
    soundFx.playSuccess();
    onCompleteLesson(lesson.id, lesson.courseId);
  };

  const tabs = [
    { id: 'concept', label: '1. Concept', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'example', label: '2. Code Example', icon: <Code2 className="w-4 h-4" /> },
    { id: 'breakdown', label: '3. Line by Line', icon: <Layers className="w-4 h-4" /> },
    { id: 'tip', label: '4. Important Tip', icon: <Lightbulb className="w-4 h-4" /> },
  ] as const;

  return (
    <div id="lesson-screen" className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Breadcrumb & Progress Header */}
      <div className="cose-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#777777] uppercase tracking-wider">
            <span
              onClick={() => onNavigate('courses')}
              className="hover:text-[#58CC02] cursor-pointer transition-colors"
            >
              {lesson.courseTitle}
            </span>
            <span>/</span>
            <span>Module 3: Repetition</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              {lesson.title}
            </h1>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#DBF8C5] text-[#58A700] border border-[#58CC02]/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                COMPLETED
              </span>
            )}
          </div>
        </div>

        {/* Section Progress */}
        <div className="sm:text-right space-y-1.5 min-w-[180px]">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-extrabold text-[#777777]">
            <span>Lesson {lesson.order} of {lesson.totalInCourse}</span>
            <span className="text-[#58A700]">({sectionProgressPercent}%)</span>
          </div>
          <ProgressBar value={sectionProgressPercent} color="green" size="sm" />
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeStepTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`lesson-tab-${tab.id}`}
              onClick={() => {
                soundFx.playClick();
                setActiveStepTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs sm:text-sm font-extrabold uppercase tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#58CC02] text-white border-b-4 border-[#58A700]'
                  : 'bg-white text-[#777777] hover:text-[#3C3C3C] border-2 border-[#E5E5E5] border-b-4 hover:border-[#AFAFAF]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Concept */}
      {activeStepTab === 'concept' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
                {lesson.conceptTitle}
              </h2>
              <p className="text-sm text-[#777777] font-semibold mt-1">
                {lesson.subtitle}
              </p>
            </div>
            <CoseMascot mood="thinking" size="md" />
          </div>

          <div className="space-y-4 text-[#3C3C3C] text-sm sm:text-base leading-relaxed font-medium">
            {lesson.explanation.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {lesson.realWorldAnalogy && (
            <div className="p-5 rounded-[16px] bg-[#FFFBE6] border-2 border-[#FFE885] space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#CC9900]">
                <Lightbulb className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                <span>Real-World Mental Model</span>
              </div>
              <p className="text-xs sm:text-sm text-[#3C3C3C] leading-relaxed font-semibold">
                {lesson.realWorldAnalogy}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => onOpenMentor(`Explain "${lesson.conceptTitle}" with another beginner-friendly example`)}
              className="btn-outline text-xs font-extrabold"
            >
              <Sparkles className="w-4 h-4 text-[#1CB0F6]" />
              <span>Ask Mentor For Nudge</span>
            </button>
            <button
              onClick={() => setActiveStepTab('example')}
              className="btn-primary"
            >
              <span>Next: Code Example</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Code Example */}
      {activeStepTab === 'example' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              Interactive Code Example
            </h2>
            <p className="text-sm text-[#777777] font-semibold mt-1">
              Read through the code snippet below. Notice how each token behaves.
            </p>
          </div>

          {/* Syntax Highlighted Code Block (LTR & Pre-wrap always) */}
          <CodeBlock
            code={lesson.codeSnippet}
            language="python"
            showLineNumbers={true}
          />

          <div className="p-4 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
              Expected Output
            </span>
            <pre
              dir="ltr"
              className="font-mono text-xs text-[#3C3C3C] whitespace-pre-wrap break-all text-left bg-white p-3 rounded-[10px] border border-[#E5E5E5]"
            >
              {lesson.simulatedOutput || 'T-minus 5\nT-minus 4\nT-minus 3\nT-minus 2\nT-minus 1\nBlast off!'}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => setActiveStepTab('concept')}
              className="btn-outline text-xs font-extrabold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Concept</span>
            </button>
            <button
              onClick={() => setActiveStepTab('breakdown')}
              className="btn-primary"
            >
              <span>Next: Line Breakdown</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Line by Line Breakdown */}
      {activeStepTab === 'breakdown' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              Line-by-Line Breakdown
            </h2>
            <p className="text-sm text-[#777777] font-semibold mt-1">
              Click any line in the code block or list below to see its exact mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <CodeBlock
              code={lesson.codeSnippet}
              language="python"
              selectedLine={selectedLine}
              onLineClick={(num) => setSelectedLine(num)}
            />

            {/* Explanations List */}
            <div className="space-y-3">
              {lesson.lineBreakdown.map((item) => {
                const isSelected = selectedLine === item.lineNumber;
                return (
                  <div
                    key={item.lineNumber}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedLine(item.lineNumber);
                    }}
                    className={`p-3.5 rounded-[14px] border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#DBF8C5] border-[#58CC02] shadow-xs'
                        : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-[#58CC02] text-white font-extrabold text-[11px] flex items-center justify-center">
                        {item.lineNumber}
                      </span>
                      <InlineCode>{item.code}</InlineCode>
                    </div>
                    <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => setActiveStepTab('example')}
              className="btn-outline text-xs font-extrabold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Code</span>
            </button>
            <button
              onClick={() => setActiveStepTab('tip')}
              className="btn-primary"
            >
              <span>Next: Golden Tip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Golden Tip & Completion */}
      {activeStepTab === 'tip' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <CoseMascot mood="celebrating" size="md" />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
                {lesson.importantTip?.title || 'Pro-Coder Rule & Common Trap'}
              </h2>
              <p className="text-sm text-[#777777] font-semibold mt-1">
                Keep this in your memory bank for live coding sessions.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[16px] bg-[#FFF5E6] border-2 border-[#FFD9A6] space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#CC7A00]">
              Key Takeaway
            </span>
            <p className="text-sm sm:text-base text-[#3C3C3C] font-bold leading-relaxed">
              {lesson.importantTip?.description || (typeof lesson.importantTip === 'string' ? lesson.importantTip : '')}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => onNavigate('practice', { exerciseId: 'ex-python-while-1' })}
              className="btn-secondary w-full sm:w-auto"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Jump Straight to Live Practice</span>
            </button>

            <button
              id="lesson-mark-complete-btn"
              onClick={handleMarkComplete}
              className="btn-primary w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Lesson Complete (+50 XP)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
