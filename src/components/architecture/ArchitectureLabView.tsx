import React, { useState, useEffect } from 'react';
import { UserProfile, ArchitectureChallenge, ArchitectureQuality } from '../../types';
import { ARCHITECTURE_CHALLENGES } from '../../data/architectureChallenges';
import { useLanguage } from '../../i18n/LanguageContext';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { CodeBlock } from '../code/CodeBlock';
import { CoseMascot } from '../common/CoseMascot';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Layers, 
  Server,
  Cpu,
  Database
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
  
  // Evaluation state
  const [selectedQuality, setSelectedQuality] = useState<ArchitectureQuality | null>(null);
  const [qualityEvaluated, setQualityEvaluated] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<string | null>(null);
  const [diagnosticEvaluated, setDiagnosticEvaluated] = useState(false);
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  const [impactEvaluated, setImpactEvaluated] = useState(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationRun, setSimulationRun] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const filteredChallenges = ARCHITECTURE_CHALLENGES.filter((ch) => {
    if (selectedCategory === 'all') return true;
    return ch.category === selectedCategory;
  });

  const currentChallenge = filteredChallenges[activeChallengeIndex] || ARCHITECTURE_CHALLENGES[0];

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
    }, 1000);
  };

  const handleSelectQuality = (quality: ArchitectureQuality) => {
    setSelectedQuality(quality);
    setQualityEvaluated(true);
    if (quality === currentChallenge.expectedQuality) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

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

  const handleSelectImpact = (optionId: string) => {
    setSelectedImpact(optionId);
    setImpactEvaluated(true);
    const opt = currentChallenge.productionImpactOptions.find((o) => o.id === optionId);
    if (opt?.isCorrect) {
      soundFx.playSuccess();
      if (!isAlreadyCompleted) {
        confetti({
          particleCount: 60,
          spread: 60,
          colors: ['#58CC02', '#1CB0F6', '#FFC800'],
        });
        onCompleteChallenge(currentChallenge.id, currentChallenge.xpReward);
      }
    } else {
      soundFx.playError();
    }
  };

  const categories = [
    { id: 'all', label: t('archFilterAll') },
    { id: 'scalability', label: t('archFilterScalability') },
    { id: 'error_handling', label: t('archFilterErrorHandling') },
    { id: 'frontend', label: t('archFilterFrontend') },
    { id: 'solid', label: t('archFilterSolid') },
    { id: 'concurrency', label: t('archFilterConcurrency') },
  ];

  return (
    <div id="architecture-screen" className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Top Banner */}
      <div className="cose-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CoseMascot mood="thinking" size="md" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
                {t('archBadgeLabel')}
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFFBE6] text-[#CC9900] border border-[#FFE885]">
                +{currentChallenge.xpReward} XP
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              {t('archTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-semibold leading-relaxed max-w-2xl">
              {t('archSubtitle')}
            </p>
          </div>
        </div>

        {/* Challenge Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            disabled={activeChallengeIndex === 0}
            onClick={() => setActiveChallengeIndex((prev) => Math.max(0, prev - 1))}
            className="btn-outline !p-2 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-extrabold text-[#3C3C3C]">
            {activeChallengeIndex + 1} / {filteredChallenges.length}
          </span>
          <button
            disabled={activeChallengeIndex === filteredChallenges.length - 1}
            onClick={() => setActiveChallengeIndex((prev) => Math.min(filteredChallenges.length - 1, prev + 1))}
            className="btn-outline !p-2 disabled:opacity-40"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory(cat.id);
              setActiveChallengeIndex(0);
            }}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#58CC02] text-white shadow-xs'
                : 'bg-white text-[#777777] border-2 border-[#E5E5E5] hover:border-[#AFAFAF]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Challenge Card */}
      <div className="cose-card p-6 sm:p-8 space-y-6">
        {/* Scenario Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase text-[#777777] block">
              {currentChallenge.scenarioDescription}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#3C3C3C] mt-0.5">
              {currentChallenge.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="btn-secondary text-xs font-extrabold !py-2 !px-3.5"
            >
              <Activity className="w-4 h-4" />
              <span>{isSimulating ? t('archSimulating') : t('archSimulateLoadBtn')}</span>
            </button>
          </div>
        </div>

        {/* Code Inspection Block */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
            {t('archInspectTitle')} ({currentChallenge.language})
          </span>
          <CodeBlock
            code={currentChallenge.codeSnippet}
            language={currentChallenge.language}
            showLineNumbers={true}
          />
        </div>

        {/* Simulation Output Card */}
        {simulationRun && (
          <div className="p-5 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-4 animate-fadeIn">
            <h3 className="text-sm font-extrabold text-[#3C3C3C] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#1CB0F6]" />
              <span>{t('archSimulationTitle')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* CPU */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsCpu')}</div>
                <div className="text-base font-extrabold text-[#3C3C3C]">
                  {currentChallenge.simulatedMetrics.bad.cpuPercent}%
                </div>
              </div>
              {/* Memory */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsMemory')}</div>
                <div className="text-base font-extrabold text-[#3C3C3C]">
                  {currentChallenge.simulatedMetrics.bad.memoryMb} MB
                </div>
              </div>
              {/* Latency */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsLatency')}</div>
                <div className="text-base font-extrabold text-[#3C3C3C]">
                  {currentChallenge.simulatedMetrics.bad.latencyMs}ms
                </div>
              </div>
              {/* Error Rate */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsErrorRate')}</div>
                <div className={`text-base font-extrabold ${currentChallenge.simulatedMetrics.bad.errorRatePercent > 0 ? 'text-[#FF4B4B]' : 'text-[#58A700]'}`}>
                  {currentChallenge.simulatedMetrics.bad.errorRatePercent}%
                </div>
              </div>
            </div>

            <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed bg-white p-3 rounded-[10px] border border-[#E5E5E5]">
              {currentChallenge.simulatedMetrics.bad.crashReason}
            </p>
          </div>
        )}

        {/* Evaluation Question 1: Quality Choice */}
        <div className="space-y-4 pt-4 border-t-2 border-[#E5E5E5]">
          <h3 className="text-sm font-extrabold text-[#3C3C3C]">
            {t('archCodeQuestion')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bad Option */}
            <div
              onClick={() => handleSelectQuality('bad_crashing')}
              className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                selectedQuality === 'bad_crashing'
                  ? currentChallenge.expectedQuality === 'bad_crashing'
                    ? 'bg-[#FFE0E0] border-[#FF4B4B] shadow-xs'
                    : 'bg-[#FFE0E0] border-[#FF4B4B]'
                  : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-sm font-extrabold text-[#FF4B4B]">
                <ShieldAlert className="w-5 h-5" />
                <span>{t('archChoiceBad')}</span>
              </div>
              <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                {t('archChoiceBadDesc')}
              </p>
            </div>

            {/* Good Option */}
            <div
              onClick={() => handleSelectQuality('good_scalable')}
              className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                selectedQuality === 'good_scalable'
                  ? currentChallenge.expectedQuality === 'good_scalable'
                    ? 'bg-[#DBF8C5] border-[#58CC02] shadow-xs'
                    : 'bg-[#FFE0E0] border-[#FF4B4B]'
                  : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-sm font-extrabold text-[#58A700]">
                <ShieldCheck className="w-5 h-5" />
                <span>{t('archChoiceGood')}</span>
              </div>
              <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                {t('archChoiceGoodDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Evaluation Question 2: Diagnostic Option */}
        {qualityEvaluated && (
          <div className="space-y-4 pt-4 border-t-2 border-[#E5E5E5] animate-fadeIn">
            <h3 className="text-sm font-extrabold text-[#3C3C3C]">
              {currentChallenge.diagnosticQuestion}
            </h3>

            <div className="space-y-2.5">
              {currentChallenge.diagnosticOptions.map((opt) => {
                const isSelected = selectedDiagnostic === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectDiagnostic(opt.id)}
                    className={`p-3.5 rounded-[14px] border-2 cursor-pointer transition-all ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#DBF8C5] border-[#58CC02]'
                          : 'bg-[#FFE0E0] border-[#FF4B4B]'
                        : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#3C3C3C]">
                      <span>{opt.text}</span>
                      {isSelected && (
                        <span>{opt.isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                      )}
                    </div>
                    {isSelected && (
                      <p className="text-xs text-[#777777] mt-1 font-semibold leading-relaxed">
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clean Refactoring Diff Toggle */}
        <div className="pt-4 border-t-2 border-[#E5E5E5]">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="btn-outline text-xs font-extrabold"
          >
            <Layers className="w-4 h-4 text-[#1CB0F6]" />
            <span>{showComparison ? t('archHideDiffBtn') : t('archCompareDiffBtn')}</span>
          </button>

          {showComparison && (
            <div className="mt-4 p-5 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-4 animate-fadeIn">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#58A700]">
                {t('archGoodCodeHeader')}
              </span>
              <CodeBlock
                code={currentChallenge.goodCodeSnippet}
                language={currentChallenge.language}
                showLineNumbers={true}
              />
              <div className="p-3 rounded-[10px] bg-white border border-[#E5E5E5] text-xs font-semibold text-[#3C3C3C] leading-relaxed">
                {currentChallenge.goodCodeExplanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
