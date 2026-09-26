import React, { useState } from 'react';
import { Quiz, QuizQuestion, UserProfile, NavScreen } from '../../types';
import { QUIZZES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { CoseMascot } from '../common/CoseMascot';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Zap, 
  ChevronRight,
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

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
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      if (correctCount + (currentQuestion.options.find(o => o.id === selectedOptionId)?.isCorrect ? 0 : 0) >= totalQuestions / 2) {
        confetti({
          particleCount: 80,
          spread: 70,
          colors: ['#58CC02', '#FFC800', '#1CB0F6'],
        });
      }
      onRecordScore(quiz.id, correctCount, totalQuestions);
    }
  };

  const handleRestartQuiz = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  // Results Screen View
  if (isFinished) {
    const finalScore = correctCount;
    const finalPercent = Math.round((finalScore / totalQuestions) * 100);
    const isPerfect = finalScore === totalQuestions;

    return (
      <div id="quiz-results-screen" className="max-w-2xl mx-auto space-y-8 pb-20">
        <div className="cose-card p-8 sm:p-10 text-center space-y-6">
          <div className="flex justify-center">
            <CoseMascot mood={isPerfect ? 'celebrating' : 'proud'} size="xl" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C]">
              {isPerfect ? 'Flawless Mastery! 🎉' : 'Checkpoint Completed!'}
            </h1>
            <p className="text-sm text-[#777777] font-semibold">
              You scored <strong className="text-[#58A700] font-extrabold">{finalScore} out of {totalQuestions}</strong> ({finalPercent}%)
            </p>
          </div>

          {/* XP Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] font-extrabold text-sm">
            <Zap className="w-4 h-4 fill-[#FFC800]" />
            <span>+{finalScore * 15} XP Earned</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t-2 border-[#E5E5E5]">
            <button
              id="quiz-retake-btn"
              onClick={handleRestartQuiz}
              className="btn-outline text-xs font-extrabold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              id="quiz-continue-btn"
              onClick={() => onNavigate('dashboard')}
              className="btn-primary"
            >
              <span>Continue Learning</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chosenOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
  const isCorrect = isAnswerSubmitted && !!chosenOption?.isCorrect;

  return (
    <div id="quiz-screen" className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Top Header & Progress */}
      <div className="cose-card p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#777777] uppercase tracking-wider">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="text-[#58A700]">{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} color="green" size="md" />
      </div>

      {/* Main Question Card */}
      <div className="cose-card p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
              {quiz.title}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C] mt-1">
              {currentQuestion.question}
            </h2>
          </div>
          <CoseMascot
            mood={isAnswerSubmitted ? (isCorrect ? 'celebrating' : 'encouraging') : 'thinking'}
            size="sm"
          />
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]';

            if (isAnswerSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'bg-[#DBF8C5] border-[#58CC02] text-[#58A700] shadow-xs';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'bg-[#FFE0E0] border-[#FF4B4B] text-[#FF4B4B]';
              }
            } else if (isSelected) {
              optionStyles = 'bg-[#EBF8FF] border-[#1CB0F6] shadow-xs';
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-[16px] border-2 border-b-4 cursor-pointer transition-all flex items-center justify-between ${optionStyles}`}
              >
                <span className="text-sm sm:text-base font-extrabold text-[#3C3C3C]">
                  {option.text}
                </span>
                {isAnswerSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-[#58A700] shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-[#FF4B4B] shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Bottom Banner */}
        {isAnswerSubmitted && (
          <div
            className={`p-4 rounded-[16px] border-2 space-y-1 animate-fadeIn ${
              isCorrect
                ? 'bg-[#DBF8C5] border-[#58CC02] text-[#58A700]'
                : 'bg-[#FFE0E0] border-[#FF4B4B] text-[#FF4B4B]'
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold text-sm">
              {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{isCorrect ? 'Excellent! Correct!' : 'Not quite — let\'s look at why:'}</span>
            </div>
            {chosenOption?.explanation && (
              <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed">
                {chosenOption.explanation}
              </p>
            )}
          </div>
        )}

        {/* Submit or Continue Button */}
        <div className="flex items-center justify-end pt-4 border-t-2 border-[#E5E5E5]">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className="btn-primary"
            >
              <span>CHECK ANSWER</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
