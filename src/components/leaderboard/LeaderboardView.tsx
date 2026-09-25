import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../firebase/AuthContext';
import { getLeaderboardFromFirestore } from '../../firebase/service';
import { soundFx } from '../../utils/sound';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Crown, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck,
  Layers,
  Code2,
  Terminal,
  Award
} from 'lucide-react';

interface LeaderboardViewProps {
  user: UserProfile;
  onNavigateToArchitecture?: () => void;
  onNavigateToPractice?: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  user,
  onNavigateToArchitecture,
  onNavigateToPractice,
}) => {
  const { language, isRtl } = useLanguage();
  const { currentUser, effectiveUserId, signInWithGoogle } = useAuth();
  const isHe = language === 'he';

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboardFromFirestore(25);
      
      const baseSeed: LeaderboardEntry[] = [
        {
          id: 'lead-1',
          userId: 'user_architect_1',
          displayName: isHe ? 'ד״ר נועם כהן (Principal)' : 'Dr. Noam Vance (Principal)',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          xp: 14250,
          level: 28,
          streak: 42,
          badgesCount: 16,
          rank: 1,
        },
        {
          id: 'lead-2',
          userId: 'user_sarah_lead',
          displayName: isHe ? 'שרה לוי (Staff Eng)' : 'Sarah Jenkins (Staff Eng)',
          photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
          xp: 11950,
          level: 23,
          streak: 28,
          badgesCount: 12,
          rank: 2,
        },
        {
          id: 'lead-3',
          userId: 'user_alex_dev',
          displayName: isHe ? 'אלכס פרידמן (Senior)' : 'Alex Chen (Senior)',
          photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
          xp: 9400,
          level: 19,
          streak: 19,
          badgesCount: 9,
          rank: 3,
        },
        {
          id: 'lead-4',
          userId: 'user_maya_arch',
          displayName: isHe ? 'מאיה ברק (Full-Stack)' : 'Maya Lin (Full-Stack)',
          photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80',
          xp: 7120,
          level: 15,
          streak: 14,
          badgesCount: 7,
          rank: 4,
        },
      ];

      let merged = [...(data || [])];
      baseSeed.forEach((seed) => {
        if (!merged.some((m) => m.userId === seed.userId)) {
          merged.push(seed);
        }
      });

      const currentUserName = currentUser?.displayName || user.name;
      const currentUserPhoto = currentUser?.photoURL || user.avatar;
      const existingUserIdx = merged.findIndex((m) => m.userId === effectiveUserId);
      
      if (existingUserIdx >= 0) {
        merged[existingUserIdx].xp = Math.max(merged[existingUserIdx].xp, user.xp);
        merged[existingUserIdx].streak = user.streak;
        merged[existingUserIdx].displayName = currentUserName;
      } else {
        merged.push({
          id: effectiveUserId,
          userId: effectiveUserId,
          displayName: currentUserName,
          photoURL: currentUserPhoto,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          badgesCount: user.unlockedAchievements.length,
        });
      }

      merged.sort((a, b) => b.xp - a.xp);
      merged = merged.map((m, idx) => ({ ...m, rank: idx + 1 }));

      setLeaderboard(merged);
    } catch (err) {
      console.warn('Leaderboard loading offline fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [user.xp, effectiveUserId]);

  const topThree = leaderboard.slice(0, 3);
  const currentUserEntry = leaderboard.find((item) => item.userId === effectiveUserId);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 lg:pb-12 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-200 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHe ? 'טבלת מובילי הארכיטקטורה והקוד' : 'Global Developer Leaderboard'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isHe ? 'דירוג מהנדסים וארכיטקטים עולמי' : 'Software Engineers & Architects Ranking'}
            </h1>
            <p className="text-sm text-indigo-200/90 max-w-xl leading-relaxed">
              {isHe
                ? 'התחרו עם מפתחים מרחבי העולם. פתרו תרחישי ארכיטקטורה, תקנו באגים ב-Quality Lab, הגנו על רצף הימים שלכם וטפסו בדירוג ה-XP העולמי.'
                : 'Compete with developers worldwide. Solve architecture scenarios, debug bottlenecks in the Quality Lab, and maintain your streak to climb the global XP leaderboard.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                loadLeaderboardData();
              }}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {onNavigateToArchitecture && (
              <button
                onClick={onNavigateToArchitecture}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>{isHe ? 'מעבדת ארכיטקטורה' : 'Architecture Lab'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Crown */}
        <div className="absolute top-4 right-12 opacity-15 pointer-events-none">
          <Crown className="w-32 h-32 text-indigo-300" />
        </div>
      </div>

      {/* Cloud Sync Notice (if not logged in with Google) */}
      {!currentUser && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-start">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isHe ? 'שמור על הדירוג וה-XP שלך בענן עם Google Sign-In' : 'Save your global XP rank to the cloud with Google'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHe ? 'התחבר כדי לסנכרן את ההתקדמות, תרחישי הארכיטקטורה והתגים שלך ב-Firestore.' : 'Sign in to ensure your progress, architecture milestones, and badges are securely synced to Firestore.'}
              </p>
            </div>
          </div>
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer shrink-0"
          >
            {isHe ? 'התחבר עכשיו' : 'Connect Google'}
          </button>
        </div>
      )}

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="order-2 md:order-1 flex flex-col items-center justify-end p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-3 left-3 p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs">
              #2
            </div>
            <div className="relative mb-3">
              <img
                src={topThree[1].photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
                alt={topThree[1].displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-300 dark:ring-slate-700"
              />
              <span className="absolute -bottom-2 -right-1 p-1 rounded-full bg-slate-300 text-slate-800 font-bold text-[10px]">
                🥈
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[170px] text-center">
              {topThree[1].displayName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              <Zap className="w-3.5 h-3.5 fill-indigo-500" />
              <span>{topThree[1].xp.toLocaleString()} XP</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">
              🔥 {topThree[1].streak}d {isHe ? 'רצף' : 'streak'} • {topThree[1].badgesCount || 0} {isHe ? 'תגים' : 'badges'}
            </span>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {topThree[0] && (
          <div className="order-1 md:order-2 flex flex-col items-center justify-end p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-500/40 shadow-md relative overflow-hidden transform md:-translate-y-2">
            <div className="absolute top-3 left-3 p-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
              #1
            </div>
            <Crown className="w-8 h-8 text-amber-500 animate-bounce mb-1" />
            <div className="relative mb-3">
              <img
                src={topThree[0].photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt={topThree[0].displayName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-1 p-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
                🥇
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate max-w-[180px] text-center">
              {topThree[0].displayName}
            </h3>
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>{topThree[0].xp.toLocaleString()} XP</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              🔥 {topThree[0].streak}d {isHe ? 'רצף ימים' : 'streak'} • {topThree[0].badgesCount || 0} {isHe ? 'תגי הצטיינות' : 'badges'}
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="order-3 flex flex-col items-center justify-end p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-3 left-3 p-1.5 rounded-full bg-amber-800/30 text-amber-700 dark:text-amber-300 font-black text-xs">
              #3
            </div>
            <div className="relative mb-3">
              <img
                src={topThree[2].photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'}
                alt={topThree[2].displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-700/50"
              />
              <span className="absolute -bottom-2 -right-1 p-1 rounded-full bg-amber-700 text-white font-bold text-[10px]">
                🥉
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[170px] text-center">
              {topThree[2].displayName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              <Zap className="w-3.5 h-3.5 fill-indigo-500" />
              <span>{topThree[2].xp.toLocaleString()} XP</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">
              🔥 {topThree[2].streak}d {isHe ? 'רצף' : 'streak'} • {topThree[2].badgesCount || 0} {isHe ? 'תגים' : 'badges'}
            </span>
          </div>
        )}
      </div>

      {/* Rankings List Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {isHe ? 'כל המהנדסים והארכיטקטים' : 'All Ranked Engineers'}
            </h2>
          </div>
          {currentUserEntry && (
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {isHe ? `הדירוג הנוכחי שלך: #${currentUserEntry.rank}` : `Your Rank: #${currentUserEntry.rank}`}
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {leaderboard.map((entry) => {
            const isMe = entry.userId === effectiveUserId;

            return (
              <div
                key={entry.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  isMe
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 text-center font-black text-sm text-slate-400 dark:text-slate-500">
                    #{entry.rank}
                  </span>

                  <img
                    src={entry.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={entry.displayName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-[220px]">
                        {entry.displayName}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-extrabold uppercase">
                          {isHe ? 'אתה' : 'You'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Lvl {entry.level}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                        <Flame className="w-3 h-3" />
                        {entry.streak}d
                      </span>
                      <span>•</span>
                      <span>{entry.badgesCount || 0} {isHe ? 'תגים' : 'badges'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: XP Total */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Zap className="w-4 h-4 fill-indigo-500" />
                  <span>{entry.xp.toLocaleString()} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
