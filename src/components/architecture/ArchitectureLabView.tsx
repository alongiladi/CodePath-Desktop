import React, { useState, useEffect } from 'react';
import { UserProfile, ArchitectureChallenge, ArchitectureQuality, ArchitectureCategory } from '../../types';
import { ARCHITECTURE_CHALLENGES } from '../../data/architectureChallenges';
import { useLanguage } from '../../i18n/LanguageContext';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Server, 
  Cpu, 
  Database, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Code2, 
  Zap, 
  Layers, 
  Sliders, 
  Terminal,
  HelpCircle,
  Eye,
  CheckCircle,
  XCircle,
  Flame
} from 'lucide-react';

interface ArchitectureLabViewProps {
  user: UserProfile;
  onNavigate: (screen: any, opts?: any) => void;
  onOpenMentor: (initialPrompt?: string) => void;
  onCompleteChallenge: (challengeId: string, xpReward: number) => void;
}

export const ArchitectureLabView: React.FC<ArchitectureLabViewProps> = ({
  user,
  onNavigate,
  onOpenMentor,
  onCompleteChallenge,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Evaluation state for the active challenge
  const [selectedQuality, setSelectedQuality] = useState<ArchitectureQuality | null>(null);
  const [qualityEvaluated, setQualityEvaluated] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<string | null>(null);
  const [diagnosticEvaluated, setDiagnosticEvaluated] = useState(false);
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  const [impactEvaluated, setImpactEvaluated] = useState(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationRun, setSimulationRun] = useState(false);

  // Refactoring view toggle
  const [showComparison, setShowComparison] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedGoodSnippet, setCopiedGoodSnippet] = useState(false);

  // Filter challenges by category
  const filteredChallenges = ARCHITECTURE_CHALLENGES.filter((ch) => {
    if (selectedCategory === 'all') return true;
    return ch.category === selectedCategory;
  });

  const currentChallenge = filteredChallenges[activeChallengeIndex] || ARCHITECTURE_CHALLENGES[0];

  // Reset challenge state when switching index or category
  useEffect(() => {
    setSelectedQuality(null);
    setQualityEvaluated(false);
    setSelectedDiagnostic(null);
    setDiagnosticEvaluated(false);
    setSelectedImpact(null);
    setImpactEvaluated(false);
    setSimulationRun(false);
    setIsSimulating(false);
    setShowComparison(false);
  }, [currentChallenge.id]);

  const completedList = user.completedArchitectureChallenges || [];
  const isAlreadyCompleted = completedList.includes(currentChallenge.id);

  // Copy code helper
  const handleCopy = (text: string, isGood: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isGood) {
      setCopiedGoodSnippet(true);
      setTimeout(() => setCopiedGoodSnippet(false), 2000);
    } else {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
    soundFx.playClick();
  };

  // Run simulation animation
  const handleRunSimulation = () => {
    soundFx.playClick();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationRun(true);
      if (currentChallenge.expectedQuality === 'bad_crashing') {
        soundFx.playError();
      } else {
        soundFx.playSuccess();
      }
    }, 1200);
  };

  // Handle Primary Quality Choice
  const handleSelectQuality = (quality: ArchitectureQuality) => {
    setSelectedQuality(quality);
    setQualityEvaluated(true);
    if (quality === currentChallenge.expectedQuality) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  // Handle Diagnostic Option
  const handleSelectDiagnostic = (optionId: string) => {
    setSelectedDiagnostic(optionId);
    setDiagnosticEvaluated(true);
    const opt = currentChallenge.diagnosticOptions.find((o) => o.id === optionId);
    if (opt?.isCorrect) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  // Handle Production Impact Option
  const handleSelectImpact = (optionId: string) => {
    setSelectedImpact(optionId);
    setImpactEvaluated(true);
    const opt = currentChallenge.productionImpactOptions.find((o) => o.id === optionId);
    if (opt?.isCorrect) {
      soundFx.playSuccess();
      // If all three stages are completed successfully and not already marked
      if (
        selectedQuality === currentChallenge.expectedQuality &&
        !isAlreadyCompleted
      ) {
        onCompleteChallenge(currentChallenge.id, currentChallenge.xpReward);
        confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
      }
    } else {
      soundFx.playError();
    }
  };

  const isFullySolved =
    selectedQuality === currentChallenge.expectedQuality &&
    selectedDiagnostic === currentChallenge.diagnosticOptions.find((o) => o.isCorrect)?.id &&
    selectedImpact === currentChallenge.productionImpactOptions.find((o) => o.isCorrect)?.id;

  const categories: { key: string; labelEn: string; labelHe: string }[] = [
    { key: 'all', labelEn: 'All Scenarios', labelHe: 'כל התרחישים' },
    { key: 'scalability', labelEn: 'Scalability & Database', labelHe: 'סקיילביליות ומסדי נתונים' },
    { key: 'error_handling', labelEn: 'Error Handling & Faults', labelHe: 'טיפול בשגיאות וחוסן' },
    { key: 'frontend', labelEn: 'Frontend & Lifecycle', labelHe: 'פרונטאנד ודליפות זיכרון' },
    { key: 'concurrency', labelEn: 'Concurrency & Race Conditions', labelHe: 'תהליכים מקבילים ומצב' },
    { key: 'solid_clean', labelEn: 'SOLID & Clean Code', labelHe: 'עקרונות SOLID וקוד נקי' },
  ];

  return (
    <div id="architecture-lab-screen" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                {t('archBadgeLabel')}
              </span>
              <span className="text-xs text-indigo-200/80 font-medium">
                {completedList.length} / {ARCHITECTURE_CHALLENGES.length}{' '}
                {isHe ? 'אתגרים הושלמו' : 'challenges mastered'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isHe ? 'מעבדת ארכיטקטורה: קוד רע מול קוד סקיילבילי' : 'Architecture Lab: Fragile vs Scalable Code'}
            </h1>
            <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
              {isHe
                ? 'קרא קוד אמיתי, בחן עקרונות הנדסה, זהה מתי מערכות קורסות בעומס ומתי הן בנויות בארכיטקטורה נקייה, גמישה וסקיילבילית.'
                : 'Inspect production code. Distinguish crashing bottlenecks and resource leaks from resilient, agile, and high-performance engineering.'}
            </p>
          </div>

          {/* Quick Stats Pill & Mentor Launcher */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="arch-ask-mentor-btn"
              onClick={() =>
                onOpenMentor(
                  isHe
                    ? `תוכל להסביר לי על העקרון הארכיטקטוני "${currentChallenge.architecturalPrincipleHe}" וכיצד להימנע מתקלות כאלה?`
                    : `Can you explain the architectural principle "${currentChallenge.architecturalPrinciple}" and how to prevent bottlenecks?`
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors border border-indigo-400/40 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{isHe ? 'התייעץ עם המנטור' : 'Consult Code Mentor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat.key);
                setActiveChallengeIndex(0);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isHe ? cat.labelHe : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Challenge Navigation Bar / Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {filteredChallenges.map((ch, idx) => {
            const isCurrent = idx === activeChallengeIndex;
            const isDone = completedList.includes(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveChallengeIndex(idx);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                )}
                <span className="truncate max-w-[130px]">{isHe ? ch.titleHe : ch.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            disabled={activeChallengeIndex === 0}
            onClick={() => {
              soundFx.playClick();
              setActiveChallengeIndex((p) => Math.max(0, p - 1));
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={t('archPrevChallenge')}
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </button>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {activeChallengeIndex + 1} / {filteredChallenges.length}
          </span>
          <button
            disabled={activeChallengeIndex === filteredChallenges.length - 1}
            onClick={() => {
              soundFx.playClick();
              setActiveChallengeIndex((p) => Math.min(filteredChallenges.length - 1, p + 1));
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={t('archNextChallenge')}
          >
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Challenge Layout: Split into 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Snippet & Scenario (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Header info */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {isHe ? currentChallenge.category : currentChallenge.category.toUpperCase()}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {currentChallenge.difficulty}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500" />
                    +{currentChallenge.xpReward} XP
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {isHe ? currentChallenge.titleHe : currentChallenge.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="copy-code-snippet-btn"
                  onClick={() => handleCopy(currentChallenge.codeSnippet, false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Copy snippet"
                >
                  {copiedSnippet ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Scenario Description */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="font-semibold text-slate-900 dark:text-white">
                {isHe ? 'תרחיש מערכת: ' : 'System Scenario: '}
              </strong>
              {isHe ? currentChallenge.scenarioDescriptionHe : currentChallenge.scenarioDescription}
            </div>

{/* Code Block with LTR Monospace */}
<div className="relative bg-slate-950 p-4 sm:p-5 text-left" dir="ltr">

  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-slate-800 font-mono">
    <span>{currentChallenge.language.toUpperCase()} MODULE</span>
    <span>PRODUCTION REVIEW</span>
  </div>
  <pre className="font-mono text-xs sm:text-sm text-left whitespace-pre-wrap break-all text-white">
    <code>{currentChallenge.codeSnippet}</code>
  </pre>
</div>

            {/* Simulated Load Runner Action Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                id="run-load-simulation-btn"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Activity className={`w-4 h-4 text-amber-400 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>{isSimulating ? t('archSimulating') : t('archSimulateLoadBtn')}</span>
              </button>

              <button
                id="toggle-diff-comparison-btn"
                onClick={() => {
                  soundFx.playClick();
                  setShowComparison(!showComparison);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>{showComparison ? t('archHideDiffBtn') : t('archCompareDiffBtn')}</span>
              </button>
            </div>
          </div>

          {/* Telemetry Panel / Simulation Results */}
          {simulationRun && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('archSimulationTitle')}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Load: {currentChallenge.simulatedMetrics.loadRps} concurrent req/sec
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('archMetricsCpu')}
                  </div>
                  <div
                    className={`text-lg font-bold font-mono mt-1 ${
                      currentChallenge.simulatedMetrics.bad.cpuPercent > 80 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    {currentChallenge.simulatedMetrics.bad.cpuPercent}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('archMetricsMemory')}
                  </div>
                  <div
                    className={`text-lg font-bold font-mono mt-1 ${
                      currentChallenge.simulatedMetrics.bad.memoryMb > 500 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    {currentChallenge.simulatedMetrics.bad.memoryMb} MB
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('archMetricsLatency')}
                  </div>
                  <div
                    className={`text-lg font-bold font-mono mt-1 ${
                      currentChallenge.simulatedMetrics.bad.latencyMs > 1000 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    {currentChallenge.simulatedMetrics.bad.latencyMs} ms
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('archMetricsErrorRate')}
                  </div>
                  <div
                    className={`text-lg font-bold font-mono mt-1 ${
                      currentChallenge.simulatedMetrics.bad.errorRatePercent > 0 ? 'text-rose-500' : 'text-amber-500'
                    }`}
                  >
                    {currentChallenge.simulatedMetrics.bad.errorRatePercent}%
                  </div>
                </div>
              </div>

              {/* Alert Crash Message Box */}
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-bold text-rose-900 dark:text-rose-200 block mb-0.5">
                    {isHe ? 'קריסה בפרודקשן זוהתה:' : 'Simulated Production Incident:'}
                  </strong>
                  <span className="font-mono text-rose-700 dark:text-rose-300">
                    {isHe
                      ? currentChallenge.simulatedMetrics.bad.crashReasonHe
                      : currentChallenge.simulatedMetrics.bad.crashReason}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison Diff (When Toggled) */}
          {showComparison && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isHe ? 'השוואת ארכיטקטורה: קוד נקי וסקיילבילי' : 'Scalable Architectural Refactoring'}
                  </h3>
                </div>
                <button
                  onClick={() => handleCopy(currentChallenge.goodCodeSnippet, true)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  {copiedGoodSnippet ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGoodSnippet ? t('buttonCopied') : t('buttonCopy')}</span>
                </button>
              </div>

              {/* Good Code Snippet */}
              <div className="bg-slate-950 p-4 rounded-xl text-left overflow-x-auto border border-emerald-500/30" dir="ltr">
                <div className="text-xs text-emerald-400 font-mono pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>// ✨ CLEAN & AGILE REFACTORING</span>
                  <span>O(1) OPTIMIZED</span>
                </div>
                <pre className="font-mono text-xs sm:text-sm text-slate-100 leading-relaxed overflow-x-auto">
                  <code>{currentChallenge.goodCodeSnippet}</code>
                </pre>
              </div>

              {/* Explanation of the fix */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong className="block mb-1 font-bold">
                  {isHe ? 'כיצד התיקון הארכיטקטוני פותר את הבעיה?' : 'Why this refactored architecture scales:'}
                </strong>
                {isHe ? currentChallenge.goodCodeExplanationHe : currentChallenge.goodCodeExplanation}
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {t('archKeyTakeawaysTitle')}
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {(isHe ? currentChallenge.keyTakeawaysHe : currentChallenge.keyTakeaways).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Diagnostic & Assessment (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Stage 1: Quality Identification */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isHe ? 'שלב 1: הערכת איכות ראשונית' : 'Step 1: Primary Quality Evaluation'}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('archCodeQuestion')}
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option: Bad/Crashing */}
              <button
                id="quality-choice-bad-btn"
                onClick={() => handleSelectQuality('bad_crashing')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedQuality === 'bad_crashing'
                    ? currentChallenge.expectedQuality === 'bad_crashing'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    {t('archChoiceBad')}
                  </span>
                  {selectedQuality === 'bad_crashing' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                      {currentChallenge.expectedQuality === 'bad_crashing'
                        ? isHe
                          ? 'זיהוי נכון! 🎯'
                          : 'Correct! 🎯'
                        : isHe
                        ? 'שגוי'
                        : 'Incorrect'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  {t('archChoiceBadDesc')}
                </p>
              </button>

              {/* Option: Good/Scalable */}
              <button
                id="quality-choice-good-btn"
                onClick={() => handleSelectQuality('good_scalable')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedQuality === 'good_scalable'
                    ? currentChallenge.expectedQuality === 'good_scalable'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    {t('archChoiceGood')}
                  </span>
                  {selectedQuality === 'good_scalable' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      {currentChallenge.expectedQuality === 'good_scalable'
                        ? isHe
                          ? 'זיהוי נכון! 🎯'
                          : 'Correct! 🎯'
                        : isHe
                        ? 'שגוי'
                        : 'Incorrect'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  {t('archChoiceGoodDesc')}
                </p>
              </button>
            </div>

            {/* Anti-Pattern Highlight Box */}
            {qualityEvaluated && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {isHe ? 'אנטי-פאטרן מזוהה:' : 'Identified Anti-Pattern:'}
                </div>
                <div className="font-bold text-rose-600 dark:text-rose-400">
                  {isHe ? currentChallenge.antiPatternNameHe : currentChallenge.antiPatternName}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  <strong>{isHe ? 'עקרון: ' : 'Principle: '}</strong>
                  {isHe ? currentChallenge.architecturalPrincipleHe : currentChallenge.architecturalPrinciple}
                </div>
              </div>
            )}
          </div>

          {/* Stage 2: Root-Cause Architectural Diagnostic */}
          {qualityEvaluated && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isHe ? 'שלב 2: אבחון סיבת השורש' : 'Step 2: Root Cause Diagnostic'}
                </h3>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                {isHe ? currentChallenge.diagnosticQuestionHe : currentChallenge.diagnosticQuestion}
              </p>

              <div className="space-y-2">
                {(isHe && currentChallenge.diagnosticOptionsHe
                  ? currentChallenge.diagnosticOptionsHe
                  : currentChallenge.diagnosticOptions
                ).map((opt) => {
                  const isSelected = selectedDiagnostic === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectDiagnostic(opt.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isSelected ? (
                          opt.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          )
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{opt.text}</span>
                      </div>

                      {isSelected && (
                        <div
                          className={`mt-2 pt-2 border-t text-[11px] leading-relaxed ${
                            opt.isCorrect
                              ? 'border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium'
                              : 'border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {opt.explanation}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stage 3: Production Blast Radius */}
          {diagnosticEvaluated && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isHe ? 'שלב 3: עוצמת הפגיעה בפרודקשן' : 'Step 3: Production Blast Radius'}
                </h3>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                {isHe
                  ? currentChallenge.productionImpactQuestionHe
                  : currentChallenge.productionImpactQuestion}
              </p>

              <div className="space-y-2">
                {(isHe && currentChallenge.productionImpactOptionsHe
                  ? currentChallenge.productionImpactOptionsHe
                  : currentChallenge.productionImpactOptions
                ).map((opt) => {
                  const isSelected = selectedImpact === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectImpact(opt.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isSelected ? (
                          opt.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          )
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{opt.text}</span>
                      </div>

                      {isSelected && (
                        <div
                          className={`mt-2 pt-2 border-t text-[11px] leading-relaxed ${
                            opt.isCorrect
                              ? 'border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium'
                              : 'border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {opt.explanation}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Victory & Completion Box */}
          {isFullySolved && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <h4 className="font-bold text-sm">
                  {isHe ? 'אתגר הארכיטקטורה פוצח בהצלחה! 🏆' : 'Challenge Solved Masterfully! 🏆'}
                </h4>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {isHe
                  ? `זיהית במדויק את שגיאת הארכיטקטורה, את סיבת השורש ואת ההשלכות בעומס. הרווחת +${currentChallenge.xpReward} XP!`
                  : `You accurately diagnosed the root cause, anti-pattern, and production impact under concurrency. +${currentChallenge.xpReward} XP earned!`}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setShowComparison(true);
                  }}
                  className="px-3 py-1.5 bg-white text-emerald-950 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  {isHe ? 'צפה בקוד המתוקן' : 'Inspect Clean Architecture'}
                </button>

                {activeChallengeIndex < filteredChallenges.length - 1 && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setActiveChallengeIndex((p) => p + 1);
                    }}
                    className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {t('archNextChallenge')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
