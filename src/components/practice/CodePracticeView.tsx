import React, { useState, useEffect, useRef } from 'react';
import { Exercise, UserProfile, NavScreen } from '../../types';
import { EXERCISES, LESSONS } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Lightbulb, 
  Eye, 
  Terminal, 
  AlertTriangle, 
  Check, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  ChevronRight,
  Code2,
  FileCode,
  ExternalLink
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface CodePracticeViewProps {
  exerciseId: string;
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onCompleteExercise: (exerciseId: string, xpReward?: number) => void;
  onOpenMentor: (initialPrompt?: string) => void;
}

export const CodePracticeView: React.FC<CodePracticeViewProps> = ({
  exerciseId,
  user,
  onNavigate,
  onCompleteExercise,
  onOpenMentor,
}) => {
  const currentExercise: Exercise = 
    EXERCISES.find((e) => e.id === exerciseId) || EXERCISES[0];

  const [code, setCode] = useState<string>(currentExercise.starterCode);
  const [output, setOutput] = useState<string>('');
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'running' | 'success' | 'warning' | 'error'>('idle');
  const [friendlyFeedback, setFriendlyFeedback] = useState<{
    title: string;
    explanation: string;
    hint: string;
  } | null>(null);

  // Progressive hints (revealed count: 0, 1, 2, 3)
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync starter code when exercise changes
  useEffect(() => {
    setCode(currentExercise.starterCode);
    setOutput('');
    setTerminalStatus('idle');
    setFriendlyFeedback(null);
    setHintsRevealed(0);
    setIsSuccessUnlocked(user.completedExercises.includes(currentExercise.id));
  }, [currentExercise.id, user.completedExercises]);

  // Handle Tab key in code editor (inserts 4 spaces instead of changing focus)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setCode(newValue);

      // Restore cursor position after the 4 spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleResetCode = () => {
    soundFx.playClick();
    setCode(currentExercise.starterCode);
    setOutput('');
    setTerminalStatus('idle');
    setFriendlyFeedback(null);
  };

  const handleRevealNextHint = () => {
    soundFx.playClick();
    setHintsRevealed((prev) => Math.min(currentExercise.hints.length, prev + 1));
  };

  // Mock code runner
  const handleRunCode = () => {
    soundFx.playClick();
    setTerminalStatus('running');
    setOutput('Executing in Python 3.12 sandbox...');
    setFriendlyFeedback(null);

    setTimeout(() => {
      // Evaluate basic execution based on user code
      const trimmed = code.trim();

      if (currentExercise.id === 'ex-python-while-1') {
        if (trimmed.includes('pass')) {
          setTerminalStatus('warning');
          setOutput('Program completed with no outputs.\nHint: Remember to replace `pass` with your print & decrement logic!');
          return;
        }

        if (trimmed.includes('seconds += 1') || (!trimmed.includes('seconds -=') && !trimmed.includes('seconds = seconds -'))) {
          setTerminalStatus('error');
          setOutput('Runtime Warning: Loop did not reach termination condition.\nExecution interrupted after 50 iterations to prevent infinite freeze.');
          setFriendlyFeedback({
            title: 'Potential Infinite Loop Detected',
            explanation: 'Your loop checks `while seconds > 0:`. If seconds is never reduced inside the loop, the test condition is always True forever!',
            hint: 'Add `seconds -= 1` as the last line inside the while loop.',
          });
          soundFx.playNotice();
          return;
        }

        if (trimmed.includes('while') && (trimmed.includes('seconds -= 1') || trimmed.includes('seconds = seconds - 1'))) {
          setTerminalStatus('success');
          let outputText = 'T-minus 5\nT-minus 4\nT-minus 3\nT-minus 2\nT-minus 1';
          if (trimmed.includes('Blast off')) {
            outputText += '\nBlast off!';
          }
          setOutput(outputText + '\n\n>>> Process exited with code 0');
          soundFx.playClick();
          return;
        }
      } else if (currentExercise.id === 'ex-python-while-2') {
        if (trimmed.includes('pass')) {
          setTerminalStatus('warning');
          setOutput('Program executed without modifications.');
          return;
        }
        if (trimmed.includes('total_sum += current_num') && trimmed.includes('current_num += 2')) {
          setTerminalStatus('success');
          setOutput('Total: 30\n\n>>> Process exited with code 0');
          soundFx.playClick();
          return;
        }
      }

      // Default mock run output
      setTerminalStatus('success');
      setOutput(currentExercise.expectedOutput + '\n\n>>> Process exited with code 0');
    }, 600);
  };

  // Check Solution Validator
  const handleCheckSolution = () => {
    soundFx.playClick();
    setTerminalStatus('running');
    setFriendlyFeedback(null);

    setTimeout(() => {
      const trimmed = code.trim();

      // Validation logic for Exercise 1
      if (currentExercise.id === 'ex-python-while-1') {
        if (trimmed.includes('pass')) {
          setTerminalStatus('error');
          setFriendlyFeedback({
            title: 'Placeholder "pass" detected',
            explanation: 'Python uses "pass" as a temporary empty placeholder. You need to replace it with real instructions.',
            hint: 'Replace "pass" with `print(f"T-minus {seconds}")` and `seconds -= 1`.',
          });
          soundFx.playNotice();
          return;
        }

        if (!trimmed.includes('while') || !trimmed.includes('seconds')) {
          setTerminalStatus('error');
          setFriendlyFeedback({
            title: 'Missing While Loop Structure',
            explanation: 'The exercise requires a while loop checking the seconds variable.',
            hint: 'Write `while seconds > 0:` and indent your code block 4 spaces below it.',
          });
          soundFx.playNotice();
          return;
        }

        if (trimmed.includes('seconds += 1')) {
          setTerminalStatus('error');
          setFriendlyFeedback({
            title: 'Counting in the Wrong Direction',
            explanation: 'You used `seconds += 1`, which makes the timer go 5, 6, 7... It will never reach 0!',
            hint: 'Change `+= 1` to `-= 1` so the countdown counts down toward 0.',
          });
          soundFx.playNotice();
          return;
        }

        if (!trimmed.includes('seconds -=') && !trimmed.includes('seconds = seconds - 1')) {
          setTerminalStatus('error');
          setFriendlyFeedback({
            title: 'Missing Counter Decrement',
            explanation: 'Every countdown needs to step down each second. Without `seconds -= 1`, your program would run forever.',
            hint: 'Add `seconds -= 1` on the last indented line of the loop.',
          });
          soundFx.playNotice();
          return;
        }

        if (!trimmed.includes('Blast off') && !trimmed.includes('blast off')) {
          setTerminalStatus('error');
          setFriendlyFeedback({
            title: 'Missing Concluding Message',
            explanation: 'The loop finishes, but the rocket needs to blast off! We expected `print("Blast off!")` after the loop.',
            hint: 'Add `print("Blast off!")` at the very bottom, without any indentation.',
          });
          soundFx.playNotice();
          return;
        }

        // Passed!
        setTerminalStatus('success');
        setOutput(`T-minus 5\nT-minus 4\nT-minus 3\nT-minus 2\nT-minus 1\nBlast off!\n\n✓ All 5 automated unit tests passed!`);
        setIsSuccessUnlocked(true);
        onCompleteExercise(currentExercise.id, currentExercise.xpReward);
        return;
      }

      // Default pass for other exercises
      if (trimmed.includes('pass')) {
        setTerminalStatus('error');
        setFriendlyFeedback({
          title: 'Unfinished Placeholder',
          explanation: 'Please replace "pass" with the requested calculation.',
          hint: 'Review the objectives checklist on the left.',
        });
        soundFx.playNotice();
        return;
      }

      setTerminalStatus('success');
      setOutput(currentExercise.expectedOutput + '\n\n✓ All unit assertions verified successfully!');
      setIsSuccessUnlocked(true);
      onCompleteExercise(currentExercise.id, currentExercise.xpReward);
    }, 650);
  };

  const handleApplySolution = () => {
    soundFx.playClick();
    setCode(currentExercise.solutionCode);
    setIsSolutionModalOpen(false);
  };

  const lineCount = Math.max(12, code.split('\n').length);

  return (
    <div id="practice-screen" className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Exercise Navigation Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Interactive Coding Workbench
              </span>
              <Badge variant="primary" size="sm">
                +{currentExercise.xpReward} XP
              </Badge>
              {isSuccessUnlocked && (
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Solved</span>
                </Badge>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {currentExercise.title}
            </h2>
          </div>
        </div>

        {/* Exercise Switcher Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Exercise:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {EXERCISES.map((ex, idx) => {
              const isSelected = ex.id === currentExercise.id;
              const isDone = user.completedExercises.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  id={`select-exercise-${idx + 1}`}
                  onClick={() => {
                    soundFx.playClick();
                    onNavigate('practice', { exerciseId: ex.id });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>#{idx + 1}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Instructions & Hints / Right Editor & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Task Description, Objectives & Hints */}
        <div className="lg:col-span-5 space-y-5">
          {/* Task Objectives Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Instructions
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                {currentExercise.taskDescription}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Requirements Checklist:
              </span>
              <div className="space-y-2">
                {currentExercise.requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <div className="mt-0.5 w-4 h-4 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                      {isSuccessUnlocked ? (
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      )}
                    </div>
                    <span className="leading-snug">{req.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Output Preview */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Target Output:
              </span>
              <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 whitespace-pre">
                {currentExercise.expectedOutput}
              </div>
            </div>
          </div>

          {/* Progressive Hint System Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Progressive Hints
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {hintsRevealed} of {currentExercise.hints.length} unlocked
              </span>
            </div>

            {hintsRevealed === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Stuck on syntax or loop bounds? Unlock progressive hints step-by-step without spoiling the complete solution.
              </p>
            ) : (
              <div className="space-y-2.5">
                {currentExercise.hints.slice(0, hintsRevealed).map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium"
                  >
                    {hint}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {hintsRevealed < currentExercise.hints.length ? (
                <button
                  id="reveal-hint-btn"
                  onClick={handleRevealNextHint}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Reveal Next Hint ({hintsRevealed + 1}/{currentExercise.hints.length})</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  All hints revealed
                </span>
              )}

              <button
                id="show-solution-modal-btn"
                onClick={() => setIsSolutionModalOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Show Solution</span>
              </button>
            </div>
          </div>

          {/* Ask Code Mentor shortcut */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-indigo-950 dark:text-indigo-100">
                  Need personalized feedback?
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Code Mentor can inspect your countdown code.
                </div>
              </div>
            </div>
            <button
              id="practice-ask-mentor-btn"
              onClick={() => onOpenMentor(`Review my practice code for ${currentExercise.title}`)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors shrink-0 shadow-xs"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): Interactive Code Editor + Output Terminal */}
        <div className="lg:col-span-7 space-y-5">
          {/* Code Editor Container */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
            {/* Editor Header Bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-slate-300 font-semibold">exercise_solution.py</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                  Python
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="editor-reset-code-btn"
                  onClick={handleResetCode}
                  title="Reset to starter code"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Editor Area with Line Numbers */}
            <div className="flex bg-slate-950 font-mono text-xs sm:text-sm">
              {/* Line numbers gutter */}
              <div className="py-4 px-3 select-none text-slate-600 bg-slate-900/60 border-r border-slate-800 text-right font-mono min-w-[42px] space-y-1">
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i} className="leading-6 text-[11px]">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  id="practice-code-editor"
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  rows={lineCount}
                  className="w-full h-full p-4 bg-transparent text-slate-100 font-mono resize-none focus:outline-none leading-6 selection:bg-indigo-600/40"
                  placeholder="Write your Python code here..."
                />
              </div>
            </div>

            {/* Editor Action Toolbar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Tab key inserts 4 spaces • Indentation matters
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  id="run-code-btn"
                  onClick={handleRunCode}
                  disabled={terminalStatus === 'running'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-300" />
                  <span>Run Code</span>
                </button>

                <button
                  id="check-solution-btn"
                  onClick={handleCheckSolution}
                  disabled={terminalStatus === 'running'}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Check Solution</span>
                </button>
              </div>
            </div>
          </div>

          {/* Friendly Diagnostic Feedback Message (if incorrect) */}
          {friendlyFeedback && (
            <div
              id="friendly-feedback-alert"
              className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 shadow-xs space-y-2 animate-fadeIn"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100">
                  {friendlyFeedback.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">
                {friendlyFeedback.explanation}
              </p>
              <div className="pt-1 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Next step: {friendlyFeedback.hint}</span>
              </div>
            </div>
          )}

          {/* Success Banner (if solved) */}
          {isSuccessUnlocked && terminalStatus === 'success' && (
            <div
              id="practice-success-banner"
              className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-4 animate-fadeIn"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    Challenge Solved! +{currentExercise.xpReward} XP
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Great work implementing your while loop with clean decrement logic!
                  </p>
                </div>
              </div>

              <button
                id="practice-next-action-btn"
                onClick={() => onNavigate('quiz', { quizId: 'quiz-python-loops' })}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Take Checkpoint Quiz</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Terminal / Output Console */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Execution Console</span>
              </div>

              <div className="flex items-center gap-2">
                {terminalStatus === 'running' && (
                  <span className="text-[11px] font-bold text-indigo-500 animate-pulse">Running...</span>
                )}
                {terminalStatus === 'success' && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Ready</span>
                )}
                {terminalStatus === 'error' && (
                  <span className="text-[11px] font-bold text-rose-500">Needs Adjustment</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-950 font-mono text-xs min-h-[120px] max-h-[220px] overflow-y-auto">
              {output ? (
                <pre
                  className={`whitespace-pre-wrap leading-relaxed ${
                    terminalStatus === 'error'
                      ? 'text-amber-400'
                      : terminalStatus === 'success'
                      ? 'text-emerald-300'
                      : 'text-slate-300'
                  }`}
                >
                  {output}
                </pre>
              ) : (
                <span className="text-slate-600 select-none">
                  Press &quot;Run Code&quot; to test your code or &quot;Check Solution&quot; to submit.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Show Solution Modal */}
      <Modal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        title="Official Reference Solution"
        subtitle={`Inspect the clean reference implementation for ${currentExercise.title}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Compare this solution to your code. Notice how the counter variable is decremented inside the loop block.
          </p>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300">
            <pre>{currentExercise.solutionCode}</pre>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsSolutionModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <button
              id="apply-solution-btn"
              onClick={handleApplySolution}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
            >
              Insert into My Editor
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
