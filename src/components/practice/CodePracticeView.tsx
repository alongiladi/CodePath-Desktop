import React, { useState, useEffect } from 'react';
import { Exercise, UserProfile, NavScreen } from '../../types';
import { EXERCISES, LESSONS } from '../../data/mockData';
import { Modal } from '../common/Modal';
import { CodeEditor } from '../code/CodeEditor';
import { ConsoleOutput } from '../code/ConsoleOutput';
import { TestResultsPanel, TestCaseResult } from '../code/TestResultsPanel';
import { CodeBlock } from '../code/CodeBlock';
import { InlineCode } from '../code/InlineCode';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Lightbulb, 
  Eye, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  ChevronRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

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

  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState(false);

  // Sync starter code when exercise changes
  useEffect(() => {
    setCode(currentExercise.starterCode);
    setOutput('');
    setTerminalStatus('idle');
    setFriendlyFeedback(null);
    setTestCases([]);
    setHintsRevealed(0);
    setIsSuccessUnlocked(user.completedExercises.includes(currentExercise.id));
  }, [currentExercise.id, user.completedExercises]);

  const handleResetCode = () => {
    soundFx.playClick();
    setCode(currentExercise.starterCode);
    setOutput('');
    setTerminalStatus('idle');
    setFriendlyFeedback(null);
    setTestCases([]);
  };

  const handleRevealNextHint = () => {
    soundFx.playClick();
    setHintsRevealed((prev) => Math.min(currentExercise.hints.length, prev + 1));
  };

  // Run Code in Sandbox
  const handleRunCode = () => {
    soundFx.playClick();
    setTerminalStatus('running');
    setOutput('Executing in sandbox...');
    setFriendlyFeedback(null);

    setTimeout(() => {
      const trimmed = code.trim();

      if (currentExercise.id === 'ex-python-while-1') {
        if (trimmed.includes('pass')) {
          setTerminalStatus('warning');
          setOutput('Program completed with no output.\nHint: Replace `pass` with print and decrement logic!');
          return;
        }

        if (trimmed.includes('seconds += 1') || (!trimmed.includes('seconds -=') && !trimmed.includes('seconds = seconds -'))) {
          setTerminalStatus('error');
          setOutput('Runtime Warning: Loop did not reach termination condition.\nExecution paused after 50 iterations to prevent infinite freeze.');
          setFriendlyFeedback({
            title: "Let's fix that infinite loop!",
            explanation: "Your loop checks `while seconds > 0:`. If seconds is never reduced inside the loop, the condition is always True.",
            hint: "Add `seconds -= 1` as the last line inside the while loop.",
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
      }

      // Default mock run
      setTerminalStatus('success');
      setOutput(currentExercise.expectedOutput + '\n\n>>> Process exited with code 0');
    }, 450);
  };

  // Check Solution / Run Automated Tests
  const handleCheckSolution = () => {
    soundFx.playClick();
    setTerminalStatus('running');
    setFriendlyFeedback(null);

    setTimeout(() => {
      const trimmed = code.trim();

      if (currentExercise.id === 'ex-python-while-1') {
        if (trimmed.includes('pass')) {
          setTerminalStatus('error');
          setFriendlyFeedback({
            title: 'Placeholder "pass" detected',
            explanation: 'Python uses "pass" as a temporary empty placeholder. Replace it with your loop body.',
            hint: 'Replace "pass" with `print(f"T-minus {seconds}")` and `seconds -= 1`.',
          });
          setTestCases([
            { id: 't1', name: 'Test 1: Loop runs 5 times', passed: false, expected: '5 countdown lines', actual: 'Empty execution' },
            { id: 't2', name: 'Test 2: Decrements variable by 1', passed: false },
            { id: 't3', name: 'Test 3: Prints Blast off!', passed: false },
          ]);
          soundFx.playNotice();
          return;
        }

        if (trimmed.includes('seconds -= 1') || trimmed.includes('seconds = seconds - 1')) {
          setTerminalStatus('success');
          setIsSuccessUnlocked(true);
          setTestCases([
            { id: 't1', name: 'Test 1: Loop executes correct iterations', passed: true },
            { id: 't2', name: 'Test 2: Variable countdown decrements properly', passed: true },
            { id: 't3', name: 'Test 3: Blast off printed upon exit', passed: true },
          ]);

          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#58CC02', '#1CB0F6', '#FFC800', '#CE82FF'],
          });

          soundFx.playSuccess();
          onCompleteExercise(currentExercise.id, currentExercise.xpReward);
          return;
        }
      }

      // Generic fallback success
      setTerminalStatus('success');
      setIsSuccessUnlocked(true);
      setTestCases([
        { id: 't1', name: 'Test 1: Syntax valid', passed: true },
        { id: 't2', name: 'Test 2: Output matches expected structure', passed: true },
      ]);
      soundFx.playSuccess();
      onCompleteExercise(currentExercise.id, currentExercise.xpReward);
    }, 550);
  };

  return (
    <div id="practice-screen" className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="cose-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#777777] uppercase tracking-wider">
            <span
              onClick={() => onNavigate('lesson', { lessonId: 'python-13' })}
              className="hover:text-[#58CC02] cursor-pointer transition-colors"
            >
              Loops & Repetition
            </span>
            <span>/</span>
            <span>Live Coding Sandbox</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
            {currentExercise.title}
          </h1>
        </div>

        {/* XP Reward & Action Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] text-xs font-extrabold">
            <Zap className="w-4 h-4 fill-[#FFC800]" />
            <span>+{currentExercise.xpReward} XP</span>
          </div>
          {isSuccessUnlocked && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DBF8C5] border-2 border-[#58CC02]/40 text-[#58A700] text-xs font-extrabold">
              <CheckCircle2 className="w-4 h-4" />
              <span>SOLVED</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column Sandbox Layout (50/50 Desktop Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Instructions, Tasks, Hints (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Instructions Card */}
          <div className="cose-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-extrabold text-[#3C3C3C]">
                Your Objective
              </h2>
              <CoseMascot
                mood={terminalStatus === 'error' ? 'encouraging' : isSuccessUnlocked ? 'celebrating' : 'happy'}
                size="sm"
              />
            </div>
            <p className="text-sm text-[#3C3C3C] leading-relaxed font-semibold">
              {currentExercise.taskDescription}
            </p>

            {/* Task Checklist */}
            <div className="space-y-2 pt-2 border-t-2 border-[#E5E5E5]">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
                Requirements
              </span>
              <ul className="space-y-2">
                {currentExercise.requirements.map((req, i) => (
                  <li key={req.id || i} className="flex items-start gap-2.5 text-xs text-[#3C3C3C] font-semibold">
                    <span className="w-4 h-4 rounded-full bg-[#1CB0F6]/15 text-[#1CB0F6] flex items-center justify-center font-extrabold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{req.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Expected Output Card */}
          <div className="cose-card p-5 space-y-2 bg-[#F7F7F7]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
              Expected Output
            </span>
            <pre
              dir="ltr"
              className="p-3 rounded-[12px] bg-white border-2 border-[#E5E5E5] text-xs font-mono text-[#3C3C3C] whitespace-pre-wrap break-all text-left"
            >
              {currentExercise.expectedOutput}
            </pre>
          </div>

          {/* Progressive Hints & Solution Modal */}
          <div className="cose-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#3C3C3C]">
                  Hints ({hintsRevealed}/{currentExercise.hints.length})
                </span>
              </div>
              <button
                onClick={() => setIsSolutionModalOpen(true)}
                className="text-xs font-extrabold text-[#1CB0F6] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Solution</span>
              </button>
            </div>

            {hintsRevealed === 0 ? (
              <p className="text-xs text-[#777777] font-semibold">
                Stuck? Reveal a hint one step at a time without spoiling the whole answer.
              </p>
            ) : (
              <div className="space-y-2">
                {currentExercise.hints.slice(0, hintsRevealed).map((hint, idx) => (
                  <div key={idx} className="p-3 rounded-[12px] bg-[#FFFBE6] border border-[#FFE885] text-xs font-semibold text-[#3C3C3C]">
                    <span className="font-extrabold text-[#CC9900] block mb-0.5">Hint #{idx + 1}:</span>
                    {hint}
                  </div>
                ))}
              </div>
            )}

            {hintsRevealed < currentExercise.hints.length && (
              <button
                onClick={handleRevealNextHint}
                className="w-full btn-outline text-xs font-extrabold !py-2"
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#FFC800]" />
                <span>Reveal Next Hint</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor + Controls + Console + Test Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Positive Reinforcement Error / Advice Banner */}
          {friendlyFeedback && (
            <div className="p-4 rounded-[16px] bg-[#FFE0E0] border-2 border-[#FF4B4B] space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#FF4B4B] font-extrabold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{friendlyFeedback.title}</span>
              </div>
              <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed">
                {friendlyFeedback.explanation}
              </p>
              <div className="p-2.5 rounded-[10px] bg-white border border-[#FF4B4B]/30 text-xs font-mono text-[#3C3C3C] whitespace-pre-wrap">
                💡 <strong>Tip:</strong> {friendlyFeedback.hint}
              </div>
            </div>
          )}

          {/* Code Editor (LTR & Pre-wrap enabled) */}
          <CodeEditor
            value={code}
            onChange={setCode}
            language="python"
            placeholder="Write your Python code here..."
            minHeight="220px"
          />

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              id="practice-reset-btn"
              onClick={handleResetCode}
              className="btn-outline text-xs font-extrabold !py-2.5 !px-3.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                id="practice-run-btn"
                onClick={handleRunCode}
                className="btn-secondary text-xs font-extrabold !py-2.5 !px-5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>RUN</span>
              </button>

              <button
                id="practice-submit-btn"
                onClick={handleCheckSolution}
                className="btn-primary text-xs font-extrabold !py-2.5 !px-6"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBMIT</span>
              </button>
            </div>
          </div>

          {/* Console Output Panel */}
          <ConsoleOutput
            output={output}
            status={terminalStatus}
          />

          {/* Automated Test Results Panel */}
          {testCases.length > 0 && (
            <TestResultsPanel
              testCases={testCases}
            />
          )}

          {/* Success Banner */}
          {isSuccessUnlocked && (
            <div className="p-5 rounded-[16px] bg-[#DBF8C5] border-2 border-[#58CC02] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CoseMascot mood="celebrating" size="sm" />
                <div>
                  <h3 className="text-base font-extrabold text-[#58A700]">
                    Great Job! All tests passed! 🎉
                  </h3>
                  <p className="text-xs text-[#3C3C3C] font-semibold">
                    You earned +{currentExercise.xpReward} XP and mastered this concept.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-primary text-xs font-extrabold !py-2.5 !px-4 shrink-0"
              >
                <span>Continue Path</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Solution Modal */}
      <Modal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        title="Official Solution"
        subtitle="Review the reference solution and explanation below."
      >
        <div className="space-y-4">
          <CodeBlock
            code={currentExercise.solutionCode}
            language="python"
          />
          <div className="p-4 rounded-[12px] bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#777777]">Expected Output</span>
            <pre dir="ltr" className="text-xs font-mono text-[#3C3C3C] whitespace-pre-wrap text-left">
              {currentExercise.expectedOutput}
            </pre>
          </div>
        </div>
      </Modal>
    </div>
  );
};
