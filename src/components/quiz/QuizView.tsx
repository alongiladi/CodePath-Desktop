import React, { useState } from 'react';
import { Quiz, QuizQuestion, UserProfile, NavScreen } from '../../types';
import { QUIZZES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Zap, 
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface QuizViewProps {
  quizId: string;
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onRecordScore: (quizId: string, score: number, total: number) => void;
  onOpenMentor: (prompt?: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizId,
  user,
  onNavigate,
  onRecordScore,
  onOpenMentor,
}) => {
  const quiz: Quiz = QUIZZES[quizId] || QUIZZES['quiz-python-loops'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const currentQuestion: QuizQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundFx.playClick();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const chosen = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!chosen?.isCorrect;

    if (isCorrect) {
      soundFx.playSuccess();
      setCorrectCount((prev) => prev + 1);
    } else {
      soundFx.playNotice();
    }

    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOptionId }));
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setIsFinished(true);
      onRecordScore(quiz.id, correctCount, totalQuestions);
    }
  };

  const handleTryAgainQuestion = () => {
    soundFx.playClick();
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
  };

  const handleRestartQuiz = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setIsFinished(false);
    setUserAnswers({});
  };

  // Results Screen View
  if (isFinished) {
    const finalScore = correctCount;
    const finalPercent = Math.round((finalScore / totalQuestions) * 100);
    const isPerfect = finalScore === totalQuestions;

    return (
      <div id="quiz-results-screen" className="max-w-3xl mx-auto space-y-6 pb-16">
        {/* Results Hero Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-800/80 shadow-md">
            {isPerfect ? <Trophy className="w-9 h-9 text-amber-500 animate-bounce" /> : <Award className="w-9 h-9" />}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isPerfect ? 'Flawless Mastery! 🎉' : 'Checkpoint Completed!'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You scored <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{finalScore} out of {totalQuestions}</strong> ({finalPercent}%)
            </p>
          </div>

          {/* XP Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm">
            <Zap className="w-4 h-4 fill-indigo-500" />
            <span>+{finalScore * 15} XP Earned</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              id="quiz-retake-btn"
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              id="quiz-continue-learning-btn"
              onClick={() => onNavigate('lesson', { lessonId: 'python-14', courseId: 'python-beginners' })}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <span>Next Lesson: The For Loop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Question Review Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Question Review & Explanations:
          </h3>

          <div className="space-y-4">
            {quiz.questions.map((q, idx) => {
              const selectedId = userAnswers[q.id];
              const chosen = q.options.find((o) => o.id === selectedId);
              const correct = q.options.find((o) => o.isCorrect);
              const isAnsCorrect = chosen?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
                    isAnsCorrect
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  } space-y-2`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {isAnsCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>Question {idx + 1}: {q.question}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Correct Answer:</strong> {correct?.text} — {correct?.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Single-Question View
  const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);

  return (
    <div id="quiz-question-screen" className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Checkpoint Quiz
            </span>
            <Badge variant="primary" size="sm">
              +{currentQuestion.xpReward} XP per Question
            </Badge>
          </div>
          <div className="text-xs font-bold text-slate-500">
            Score: <span className="text-indigo-600 dark:text-indigo-400">{correctCount}</span> / {currentIndex}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} color="indigo" size="sm" />
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {currentQuestion.question}
          </h3>
          {currentQuestion.codeSnippet && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-emerald-300">
              <pre>{currentQuestion.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900';

            if (isSelected && !isAnswerSubmitted) {
              optionStyles = 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-xs';
            } else if (isAnswerSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
              } else {
                optionStyles = 'opacity-50 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <div
                key={option.id}
                id={`quiz-option-${idx + 1}`}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? isAnswerSubmitted
                          ? option.isCorrect
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-rose-500 bg-rose-500 text-white'
                          : 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm font-medium leading-relaxed">
                    {option.text}
                  </span>
                </div>

                {isAnswerSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Immediate Feedback Box after Answer Submitted */}
        {isAnswerSubmitted && selectedOption && (
          <div
            id="quiz-immediate-feedback"
            className={`p-4 rounded-2xl border ${
              selectedOption.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            } space-y-1.5 animate-fadeIn`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Correct! Spot on analysis.</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Not quite right — here is why:</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed pl-6">
              {selectedOption.explanation}
            </p>
          </div>
        )}

        {/* Quiz Action Toolbar */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            id="quiz-ask-mentor-btn"
            onClick={() => onOpenMentor(`Explain question: "${currentQuestion.question}"`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ask Code Mentor</span>
          </button>

          <div className="flex items-center gap-2.5">
            {isAnswerSubmitted && !selectedOption?.isCorrect && (
              <button
                id="quiz-try-again-btn"
                onClick={handleTryAgainQuestion}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}

            {!isAnswerSubmitted ? (
              <button
                id="quiz-submit-answer-btn"
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
              >
                <span>Submit Answer</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="quiz-next-question-btn"
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-transform active:scale-95"
              >
                <span>{currentIndex + 1 < totalQuestions ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
