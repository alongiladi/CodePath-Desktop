import React from 'react';
import { NavScreen, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  LayoutDashboard, 
  Compass, 
  Terminal, 
  Trophy, 
  Settings, 
  Sparkles, 
  Flame, 
  Zap, 
  ChevronRight,
  ChevronLeft,
  Layers,
  Landmark,
  Award,
  Brain,
  Code2
} from 'lucide-react';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  user: UserProfile;
  onOpenMentor: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenMentor,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { t, language, isRtl } = useLanguage();

  const navItems: { screen: NavScreen; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      screen: 'dashboard',
      label: t('navDashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      screen: 'courses',
      label: t('navCourses'),
      icon: <Compass className="w-5 h-5" />,
      badge: '6 Paths',
    },
    {
      screen: 'practice',
      label: t('navPractice'),
      icon: <Terminal className="w-5 h-5" />,
      badge: 'Live',
    },
    {
      screen: 'architecture',
      label: t('navArchitecture'),
      icon: <Layers className="w-5 h-5" />,
      badge: isRtl ? 'מעבדת ארכיטקטורה' : 'Quality Lab',
    },
    {
      screen: 'leaderboard',
      label: t('navLeaderboard'),
      icon: <Award className="w-5 h-5" />,
      badge: 'XP Top',
    },
    {
      screen: 'achievements',
      label: t('navAchievements'),
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      screen: 'settings',
      label: t('navSettings'),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (screen: NavScreen) => {
    onNavigate(screen);
    if (onCloseMobile) onCloseMobile();
  };

  const desktopPosClass = isRtl
    ? 'right-0 border-l border-slate-200/80 dark:border-slate-800'
    : 'left-0 border-r border-slate-200/80 dark:border-slate-800';

  const mobileTransformClass = isMobileOpen
    ? 'translate-x-0'
    : isRtl
    ? 'translate-x-full'
    : '-translate-x-full';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 ${desktopPosClass} z-40 w-64 bg-white dark:bg-slate-900 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileTransformClass}`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Code2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Code<span className="text-indigo-600 dark:text-indigo-400">Path</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {isRtl ? 'אינטראקטיבי' : 'Interactive'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isRtl ? 'תכנות מעשי צעד-אחר-צעד' : 'Step-by-step programming'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Streak & XP banner */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 border border-amber-500/20 dark:border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {user.streak} {t('topbarStreak')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/30" />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {user.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t('platformMenu')}
          </div>

          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                id={`sidebar-link-${item.screen}`}
                onClick={() => handleNavClick(item.screen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* AI Code Mentor Callout Card in Sidebar */}
          <div className="pt-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700/80 text-start">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  {t('topbarMentorBtn')}
                </span>
                <span className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse ${isRtl ? 'mr-auto' : 'ml-auto'}`} title="Online" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {isRtl
                  ? 'נתקעת בתרגיל או בארכיטקטורה? בקש רמז עדין מבלי לחשוף את הפתרון המלא.'
                  : 'Stuck on a problem or architecture? Ask for gentle hints without giving away the full answer.'}
              </p>
              <button
                id="sidebar-open-mentor-btn"
                onClick={() => {
                  onOpenMentor();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full py-2 px-3 bg-white dark:bg-slate-700 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-slate-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>{isRtl ? 'שאל את המנטור' : 'Ask Mentor'}</span>
                {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* User Profile Card at Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
          <div
            id="sidebar-user-profile"
            onClick={() => handleNavClick('settings')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/40"
              />
              <span className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300">
                  {user.level}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {isRtl ? 'פייתון למתחילים' : 'Python Beginner'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

