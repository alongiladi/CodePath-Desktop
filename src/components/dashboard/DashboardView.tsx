import React from 'react';
import { UserProfile, Course, NavScreen } from '../../types';
import { COURSES, LESSONS, DAILY_CHALLENGE, ACHIEVEMENTS } from '../../data/mockData';
import { ARCHITECTURE_CHALLENGES } from '../../data/architectureChallenges';
import { useLanguage } from '../../i18n/LanguageContext';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { 
  Play, 
  Flame, 
  Zap, 
  BookCheck, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Award, 
  Target, 
  Code2, 
  Terminal, 
  ChevronRight,
  Database,
  Layout,
  GitBranch,
  Gamepad2,
  Calendar,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface DashboardViewProps {
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onOpenMentor: (initialPrompt?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  onOpenMentor,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const activeCourse = COURSES.find((c) => c.id === user.activeCourseId) || COURSES[0];
  const activeLesson = LESSONS[user.activeLessonId] || LESSONS['python-13'];
  
  // Calculate user progress in active course
  const courseLessons = activeCourse.modules.flatMap((m) => m.lessons);
  const completedInCourse = courseLessons.filter((l) => user.completedLessons.includes(l.id)).length;
  const progressPercentage = Math.round((completedInCourse / (activeCourse.totalLessons || 28)) * 100);

  const completedArchCount = (user.completedArchitectureChallenges || []).length;
  const totalArchCount = ARCHITECTURE_CHALLENGES.length;

  const recentAchievements = ACHIEVEMENTS.filter((a) => user.unlockedAchievements.includes(a.id)).slice(0, 3);

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-5 h-5 text-indigo-500" />;
      case 'Code': return <Code2 className="w-5 h-5 text-sky-500" />;
      case 'Database': return <Database className="w-5 h-5 text-emerald-500" />;
      case 'Layout': return <Layout className="w-5 h-5 text-amber-500" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-rose-500" />;
      default: return <Gamepad2 className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div id="dashboard-screen" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-48 h-48 rounded-full bg-violet-500/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {isHe ? 'למידה מותאמת אישית' : 'Personalized Learning'}
              </span>
              <span className="text-xs text-indigo-200 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {isHe ? `יום ${user.streak} של תרגול רצוף` : `Day ${user.streak} of continuous practice`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('dashWelcome')}, {user.name}! 👋
            </h2>
            <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
              {isHe
                ? `אתה מתקדם בקצב מעולה בקורס ${activeCourse.title}. מוכן לאתגר האינטראקטיבי של היום?`
                : `You are making steady progress on ${activeCourse.title}. Ready to dive into today's interactive challenge?`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="dash-resume-lesson-hero-btn"
              onClick={() => onNavigate('lesson', { lessonId: activeLesson.id, courseId: activeCourse.id })}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-indigo-950" />
              <span>{t('buttonContinueLesson')}</span>
            </button>
            <button
              id="dash-ask-mentor-hero-btn"
              onClick={() => onOpenMentor(isHe ? 'תוכל להסביר לי על לולאות ותנאים?' : 'Can you explain what we are learning in Loops and Conditions?')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm border border-indigo-500/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('topbarMentorBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-400/40 animate-pulse" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.streak} {isHe ? 'ימים' : 'Days'}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('dashActiveStreak')} 🔥
            </div>
          </div>
        </div>

        {/* XP Points */}
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-indigo-500 fill-indigo-400/40" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('dashTotalXp')}
            </div>
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shrink-0">
            <BookCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.completedLessons.length} / 28
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('dashLessonsCompleted')}
            </div>
          </div>
        </div>

        {/* Current Level */}
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {user.level}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('dashCurrentLevel')}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Architecture Lab Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border border-indigo-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                {isHe ? 'קוד רע מול קוד סקיילבילי' : 'Crashing vs Scalable Code'}
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                {completedArchCount} / {totalArchCount} {isHe ? 'פוצחו' : 'Mastered'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {isHe ? 'מעבדת ארכיטקטורה וקוד נקי: זיהוי תקלות תוכנה' : 'Architecture Lab: Spot Bottlenecks Before Production'}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isHe
                ? 'בדוק את היכולת שלך לקרוא קוד, לזהות שאילתות N+1, חסימת Event Loop, דליפות זיכרון ורייס קונדישנס בעומס אמיתי.'
                : 'Test your architectural diagnosis. Spot N+1 bottlenecks, unhandled promise rejections, memory leaks, and race conditions under heavy load.'}
            </p>
          </div>
        </div>

        <button
          id="dash-enter-arch-lab-btn"
          onClick={() => {
            soundFx.playClick();
            onNavigate('architecture');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>{isHe ? 'כניסה למעבדת ארכיטקטורה' : 'Enter Architecture Lab'}</span>
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Grid: Continue Learning + Daily Challenge & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Learning Active Module */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Continue Learning
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeCourse.title}
                </h3>
              </div>
              <Badge variant="primary" size="sm">
                Lesson {activeLesson.order} of {activeCourse.totalLessons}
              </Badge>
            </div>

            {/* Course Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Course Completion</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{progressPercentage}% (12 of 28 completed)</span>
              </div>
              <ProgressBar value={progressPercentage} color="indigo" size="md" />
            </div>

            {/* Active Lesson Showcase Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                    Next up
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> ~10 min
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeLesson.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                  {activeLesson.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  id="dash-start-lesson-btn"
                  onClick={() => onNavigate('lesson', { lessonId: activeLesson.id, courseId: activeCourse.id })}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Open Lesson</span>
                </button>
                <button
                  id="dash-quick-practice-btn"
                  onClick={() => onNavigate('practice', { exerciseId: activeLesson.exerciseId, lessonId: activeLesson.id })}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Practice Code</span>
                </button>
              </div>
            </div>

            {/* Quick syllabus step list */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Module 3 Breakdown:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <BookCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">12. Comparisons</span>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600 shrink-0" />
                  <span className="truncate">13. Loops & Conditions</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] shrink-0">14</span>
                  <span className="truncate">For Loop & Range</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Learning Paths */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recommended Learning Paths
              </h3>
              <button
                id="dash-view-all-courses-btn"
                onClick={() => onNavigate('courses')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All 6 Paths</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSES.slice(1, 3).map((course) => (
                <div
                  key={course.id}
                  onClick={() => onNavigate('courses', { courseId: course.id })}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getCourseIcon(course.iconName)}
                    </div>
                    <Badge variant={course.badge === 'Popular' ? 'purple' : 'primary'} size="sm">
                      {course.badge}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>{course.totalLessons} lessons</span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Daily Challenge & Achievements */}
        <div className="space-y-6">
          {/* Daily Challenge Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 dark:border-amber-500/30 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white">
                Daily Challenge
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{DAILY_CHALLENGE.timeRemaining}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {DAILY_CHALLENGE.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {DAILY_CHALLENGE.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Zap className="w-4 h-4 fill-indigo-500" />
                <span>+{DAILY_CHALLENGE.xpReward} XP Reward</span>
              </div>
              <button
                id="dash-solve-challenge-btn"
                onClick={() => onNavigate('practice', { exerciseId: 'ex-python-while-2' })}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Solve Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recent Achievements Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Recent Achievements
                </h4>
              </div>
              <button
                id="dash-view-all-badges-btn"
                onClick={() => onNavigate('achievements')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recentAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {ach.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {ach.description}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    Unlocked
                  </span>
                </div>
              ))}
            </div>

            {/* Next badge progress preview */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Next: Code Marathoner</span>
                <span>{user.xp} / 2,000 XP</span>
              </div>
              <ProgressBar value={(user.xp / 2000) * 100} color="amber" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
