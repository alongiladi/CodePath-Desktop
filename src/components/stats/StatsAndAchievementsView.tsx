import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { ACHIEVEMENTS, WEEKLY_ACTIVITY, TOPIC_PROFICIENCY } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Trophy, 
  Flame, 
  Zap, 
  BookCheck, 
  Clock, 
  Lock, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface StatsAndAchievementsViewProps {
  user: UserProfile;
  onNavigate: (screen: any, opts?: any) => void;
}

export const StatsAndAchievementsView: React.FC<StatsAndAchievementsViewProps> = ({
  user,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = ACHIEVEMENTS.filter((a) => user.unlockedAchievements.includes(a.id)).length;
  const maxWeeklyMinutes = Math.max(...WEEKLY_ACTIVITY.map((d) => d.minutes));

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = user.unlockedAchievements.includes(ach.id);
    if (activeTab === 'unlocked') return isUnlocked;
    if (activeTab === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div id="stats-screen" className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="cose-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CoseMascot mood="celebrating" size="md" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C]">
              Analytics & Achievements
            </h1>
            <p className="text-sm text-[#777777] font-semibold mt-1">
              Review your consistency, study habits, mastered topics, and unlocked trophies.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-full bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] text-xs font-extrabold flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#FFC800]" />
          <span>{unlockedCount} / {ACHIEVEMENTS.length} Badges Unlocked</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed Lessons */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#DBF8C5] border-2 border-[#89E219] flex items-center justify-center shrink-0">
            <BookCheck className="w-6 h-6 text-[#58A700]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.completedLessons.length}
            </div>
            <div className="text-xs font-bold text-[#58A700] uppercase tracking-wide">
              Completed Lessons
            </div>
          </div>
        </div>

        {/* XP Points */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#FFFBE6] border-2 border-[#FFE885] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-[#FFC800] fill-[#FFC800]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-[#CC9900] uppercase tracking-wide">
              Total XP Points
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#FFF5E6] border-2 border-[#FFD9A6] flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-[#FF9600] fill-[#FF9600] animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.streak} Days
            </div>
            <div className="text-xs font-bold text-[#FF9600] uppercase tracking-wide">
              Learning Streak 🔥
            </div>
          </div>
        </div>

        {/* Study Hours */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#EBF8FF] border-2 border-[#BEE3F8] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#1CB0F6]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.totalHours} hrs
            </div>
            <div className="text-xs font-bold text-[#1CB0F6] uppercase tracking-wide">
              Total Study Time
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Weekly Activity Chart + Topic Proficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weekly Activity Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 cose-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#58A700]">
                Weekly Consistency
              </span>
              <h2 className="text-lg font-extrabold text-[#3C3C3C] mt-0.5">
                Practice Time & XP Velocity
              </h2>
            </div>
            <span className="text-xs font-bold text-[#777777]">Minutes Active</span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-2 border-b-2 border-[#E5E5E5]">
            {WEEKLY_ACTIVITY.map((d) => {
              const heightPercent = maxWeeklyMinutes > 0 ? (d.minutes / maxWeeklyMinutes) * 100 : 0;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-extrabold text-[#777777] opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.minutes}m
                  </span>
                  <div className="w-full max-w-[36px] bg-[#E5E5E5] rounded-t-[10px] h-full flex items-end overflow-hidden p-0.5">
                    <div
                      className="w-full bg-[#58CC02] rounded-t-[8px] transition-all duration-500 hover:bg-[#89E219]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-[#777777]">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Proficiencies (5 Cols) */}
        <div className="lg:col-span-5 cose-card p-6 sm:p-8 space-y-5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
            Skill Breakdown
          </span>
          <h2 className="text-lg font-extrabold text-[#3C3C3C]">
            Topic Proficiencies
          </h2>

          <div className="space-y-4 pt-1">
            {TOPIC_PROFICIENCY.map((topic) => (
              <div key={topic.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-[#3C3C3C]">
                  <span>{topic.name}</span>
                  <span className="text-[#58A700]">{topic.proficiency}%</span>
                </div>
                <ProgressBar value={topic.proficiency} size="sm" color="green" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="cose-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#3C3C3C]">
              Achievements & Badges
            </h2>
            <p className="text-xs text-[#777777] font-semibold mt-0.5">
              Unlock unique milestones by practicing consistently and writing clean code.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'unlocked', 'locked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#58CC02] text-white shadow-xs'
                    : 'bg-[#F7F7F7] text-[#777777] hover:text-[#3C3C3C] border border-[#E5E5E5]'
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
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-[16px] border-2 flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-white border-[#E5E5E5] shadow-xs'
                    : 'bg-[#F7F7F7] border-[#E5E5E5] opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 text-xl border-2 ${
                    isUnlocked
                      ? 'bg-[#FFFBE6] border-[#FFE885]'
                      : 'bg-[#E5E5E5] border-[#D7D7D7] text-gray-400'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-[#AFAFAF]" />}
                </div>

                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm text-[#3C3C3C] truncate">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-[#777777] font-semibold mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>
                  {isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#58A700] mt-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
