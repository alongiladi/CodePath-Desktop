import React, { useState } from 'react';
import { Lesson, UserProfile, NavScreen } from '../../types';
import { LESSONS, COURSES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { 
  Play, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Terminal, 
  HelpCircle, 
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
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedLine, setSelectedLine] = useState<number | null>(2);
  const isCompleted = user.completedLessons.includes(lesson.id);

  // Section progress calculation
  const currentLessonIndex = lesson.order;
  const sectionProgressPercent = Math.round((currentLessonIndex / (lesson.totalInCourse || 28)) * 100);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lesson.codeSnippet);
    soundFx.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleMarkComplete = () => {
    soundFx.playSuccess();
    onCompleteLesson(lesson.id, lesson.courseId);
  };

  const tabs = [
    { id: 'concept', label: '1. Concept', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'example', label: '2. Code Example', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'breakdown', label: '3. Line by Line', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'tip', label: '4. Important Tip', icon: <Lightbulb className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div id="lesson-screen" className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span
              onClick={() => onNavigate('courses')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              {lesson.courseTitle}
            </span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-200">Module 3: Repetition</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {lesson.title}
            </h2>
            {isCompleted && (
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Completed</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Lesson counter & section progress */}
        <div className="sm:text-right space-y-1 min-w-[160px]">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Lesson {lesson.order} of {lesson.totalInCourse}</span>
            <span className="text-indigo-600 dark:text-indigo-400">({sectionProgressPercent}%)</span>
          </div>
          <ProgressBar value={sectionProgressPercent} color="indigo" size="sm" />
        </div>
      </div>

      {/* Bite-Sized Tab Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area Based on Active Step */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
        {/* Step 1: Concept */}
        {activeStepTab === 'concept' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {lesson.conceptTitle}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {lesson.subtitle}
              </p>
            </div>

            <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {lesson.explanation.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {lesson.realWorldAnalogy && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Real-World Mental Model</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100/90 leading-relaxed font-medium">
                  {lesson.realWorldAnalogy}
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">Next up: Live syntax code example</span>
              <button
                id="lesson-next-tab-btn-1"
                onClick={() => {
                  soundFx.playClick();
                  setActiveStepTab('example');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                <span>Continue to Code Example</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Code Example */}
        {activeStepTab === 'example' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Python Code Demonstration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect the working syntax below and observe how the loop increments.
                </p>
              </div>
              <button
                id="copy-lesson-code-btn"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block with simulated terminal output */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs sm:text-sm shadow-md">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-semibold text-slate-300">while_loop_demo.py</span>
                </span>
                <span className="text-[11px] font-bold text-indigo-400 uppercase">Python 3.12</span>
              </div>

              <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
                <code>{lesson.codeSnippet}</code>
              </pre>

              {lesson.simulatedOutput && (
                <div className="border-t border-slate-800 bg-slate-900/90 p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Execution Output:</span>
                  </div>
                  <pre className="text-xs text-emerald-400 overflow-x-auto">
                    {lesson.simulatedOutput}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveStepTab('concept');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Back to Concept
              </button>
              <button
                id="lesson-next-tab-btn-2"
                onClick={() => {
                  soundFx.playClick();
                  setActiveStepTab('breakdown');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                <span>Line-by-Line Explanation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Line by Line Breakdown */}
        {activeStepTab === 'breakdown' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Line-by-Line Code Dissection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any line of code to understand its purpose and mechanics.
              </p>
            </div>

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
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Line {item.lineNumber}
                        </span>
                        <code className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/60 dark:bg-indigo-900/60 px-2 py-0.5 rounded">
                          {item.code}
                        </code>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {isSelected ? 'Active' : 'Inspect'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                      {item.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveStepTab('example');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Back to Example
              </button>
              <button
                id="lesson-next-tab-btn-3"
                onClick={() => {
                  soundFx.playClick();
                  setActiveStepTab('tip');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                <span>View Important Tip</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Important Tip */}
        {activeStepTab === 'tip' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Important Tip & Gotcha
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {lesson.importantTip.title}
                  </h4>
                </div>
              </div>

              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {lesson.importantTip.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                    Have doubts about this lesson?
                  </h5>
                  <p className="text-xs text-indigo-800 dark:text-indigo-300">
                    Code Mentor can break down while loops further or provide alternative analogies.
                  </p>
                </div>
              </div>
              <button
                id="lesson-ask-mentor-btn"
                onClick={() => onOpenMentor(`Explain more about: ${lesson.title}`)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white font-bold text-xs border border-indigo-200 dark:border-slate-700 transition-colors shrink-0"
              >
                Ask Mentor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Footer Bar */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {!isCompleted ? (
            <button
              id="lesson-mark-complete-btn"
              onClick={handleMarkComplete}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Completed (+25 XP)</span>
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lesson Completed</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Test My Knowledge Quiz button */}
          <button
            id="lesson-test-knowledge-btn"
            onClick={() => onNavigate('quiz', { quizId: lesson.quizId, lessonId: lesson.id })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Test My Knowledge</span>
          </button>

          {/* Interactive Code Practice button */}
          <button
            id="lesson-practice-code-btn"
            onClick={() => onNavigate('practice', { exerciseId: lesson.exerciseId, lessonId: lesson.id })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Terminal className="w-4 h-4" />
            <span>Practice in Editor</span>
          </button>

          {/* Next Lesson */}
          {lesson.nextLessonId && (
            <button
              id="lesson-next-step-btn"
              onClick={() => onNavigate('lesson', { lessonId: lesson.nextLessonId, courseId: lesson.courseId })}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Next lesson"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
