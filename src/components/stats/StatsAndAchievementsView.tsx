import React, { useState } from 'react';
import { UserProfile, Achievement, NavScreen } from '../../types';
import { ACHIEVEMENTS, WEEKLY_ACTIVITY, TOPIC_PROFICIENCY } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { 
  Trophy, 
  Flame, 
  Zap, 
  BookCheck, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Play, 
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface StatsAndAchievementsViewProps {
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
}

export const StatsAndAchievementsView: React.FC<StatsAndAchievementsViewProps> = ({
  user,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const unlockedCount = ACHIEVEMENTS.filter((a) => user.unlockedAchievements.includes(a.id)).length;
  const maxWeeklyMinutes = Math.max(...WEEKLY_ACTIVITY.map((d) => d.minutes));

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = user.unlockedAchievements.includes(ach.id);
    if (activeTab === 'unlocked') return isUnlocked;
    if (activeTab === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div id="stats-screen" className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Learning Analytics & Achievements
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your weekly coding habits, mastered skills, and milestone badges.
        </p>
      </div>

      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed Lessons */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shrink-0">
            <BookCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.completedLessons.length}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completed Lessons
            </div>
          </div>
        </div>

        {/* XP Points */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-indigo-500 fill-indigo-400/40" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total XP Points
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-400/40 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.streak} Days
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Learning Streak 🔥
            </div>
          </div>
        </div>

        {/* Learning Time */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.totalHours} hrs
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Learning Time
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Weekly Activity Chart + Topic Proficiencies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Activity Bar Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Weekly Consistency
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Practice Time & XP Velocity
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Minutes Active</span>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="space-y-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
              {WEEKLY_ACTIVITY.map((item) => {
                const heightPercent = Math.max(15, Math.round((item.minutes / maxWeeklyMinutes) * 100));
                const isHovered = hoveredDay === item.day;

                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredDay(item.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white transition-opacity ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {item.minutes}m / +{item.xp}XP
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-32">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          item.isToday
                            ? 'bg-gradient-to-t from-indigo-600 to-violet-500'
                            : 'bg-indigo-500/80 group-hover:bg-indigo-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span
                      className={`text-xs font-bold transition-colors ${
                        item.isToday
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900'
                      }`}
                    >
                      {item.shortDay}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Goal: 15 min/day</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Daily goal met all 7 days!
              </span>
            </div>
          </div>
        </div>

        {/* Strengths & Growth Areas (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mastery Analysis
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Knowledge Proficiency
            </h3>
          </div>

          <div className="space-y-4">
            {/* Top Strengths */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>Topics You Excel At (Strong)</span>
              </div>
              {TOPIC_PROFICIENCY.filter((t) => t.status === 'strong').slice(0, 3).map((topic, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="truncate">{topic.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{topic.proficiency}%</span>
                  </div>
                  <ProgressBar value={topic.proficiency} color="emerald" size="sm" />
                </div>
              ))}
            </div>

            {/* Growth Areas */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Topics That Need Practice</span>
              </div>
              {TOPIC_PROFICIENCY.filter((t) => t.status === 'needs_practice').map((topic, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{topic.name}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{topic.proficiency}%</span>
                  </div>
                  <ProgressBar value={topic.proficiency} color="amber" size="sm" />
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onNavigate('practice', { exerciseId: 'ex-python-while-1' })}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Practice now</span>
                      <Play className="w-3 h-3 fill-indigo-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked & Locked Achievements Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Milestone Badges ({unlockedCount} / {ACHIEVEMENTS.length} Unlocked)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Earn badges by keeping streaks alive, completing lessons, and mastering checkpoint quizzes.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'unlocked', 'locked'] as const).map((tab) => (
              <button
                key={tab}
                id={`badge-tab-${tab}`}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => {
            const isUnlocked = user.unlockedAchievements.includes(ach.id);
            const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                id={`achievement-card-${ach.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-indigo-200/80 dark:border-indigo-900/60 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-purple-500/20 border-amber-300 dark:border-amber-700/80 text-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <Trophy className="w-6 h-6 text-amber-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {ach.title}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        +{ach.xpBonus} XP
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                        <span>{isUnlocked ? 'Completed' : 'Progress'}</span>
                        <span>
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <ProgressBar
                        value={progressPercent}
                        color={isUnlocked ? 'emerald' : 'indigo'}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
