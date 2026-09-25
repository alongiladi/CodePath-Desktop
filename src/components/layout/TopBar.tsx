import React, { useState } from 'react';
import { NavScreen, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../firebase/AuthContext';
import { 
  Menu, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Zap,
  Languages,
  LogIn,
  LogOut,
  Cloud,
  CheckCircle2
} from 'lucide-react';

interface TopBarProps {
  currentScreen: NavScreen;
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
  onOpenMentor: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (screen: NavScreen) => void;
  courseTitle?: string;
  lessonTitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  user,
  isDarkMode,
  onToggleDarkMode,
  onToggleSound,
  onOpenMentor,
  onToggleMobileMenu,
  onNavigate,
  courseTitle,
  lessonTitle,
}) => {
  const { t, language, toggleLanguage, isRtl } = useLanguage();
  const { currentUser, signInWithGoogle, signOut } = useAuth();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return t('navDashboard');
      case 'courses':
        return t('navCourses');
      case 'lesson':
        return lessonTitle ? `${courseTitle || (language === 'he' ? 'קורס' : 'Course')} / ${lessonTitle}` : (language === 'he' ? 'שיעור אינטראקטיבי' : 'Interactive Lesson');
      case 'practice':
        return t('navPractice');
      case 'architecture':
        return t('navArchitecture');
      case 'leaderboard':
        return t('navLeaderboard');
      case 'quiz':
        return t('navQuiz');
      case 'achievements':
      case 'stats':
        return t('navAchievements');
      case 'settings':
        return t('navSettings');
      default:
        return 'CodePath';
    }
  };

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between transition-colors"
    >
      {/* Left section: Mobile menu trigger + Screen title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          id="mobile-menu-trigger"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-md">
            {getScreenTitle()}
          </h1>
          {currentScreen === 'dashboard' && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline truncate">
              {t('topbarWelcomeBack')}, {currentUser?.displayName || user.name} • {t('topbarDailyGoalReady')}
            </span>
          )}
        </div>
      </div>

      {/* Right section: Global Stats & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Language Switcher Button (Hebrew / English) */}
        <button
          id="toggle-language-btn"
          onClick={toggleLanguage}
          title={language === 'en' ? 'עבור למצב עברית (ישראל)' : 'Switch to English (US)'}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-sm"
          aria-label="Toggle application language"
        >
          <Languages className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px] sm:text-xs">{language === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}</span>
        </button>

        {/* Streak Pill */}
        <div
          id="topbar-streak-pill"
          title={t('topbarStreakTitle')}
          className="hidden xs:flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold"
        >
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{user.streak}d</span>
        </div>

        {/* XP Pill */}
        <div
          id="topbar-xp-pill"
          title={t('topbarXpTitle')}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
        >
          <Zap className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
          <span>{user.xp.toLocaleString()} <span className="hidden sm:inline">XP</span></span>
        </div>

        {/* Audio Toggle */}
        <button
          id="toggle-sound-btn"
          onClick={onToggleSound}
          title={user.soundEnabled ? t('topbarSoundMute') : t('topbarSoundEnable')}
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
          aria-label="Toggle UI Sound Effects"
        >
          {user.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="toggle-dark-mode-btn"
          onClick={onToggleDarkMode}
          title={isDarkMode ? t('topbarDarkLight') : t('topbarDarkDark')}
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Google Auth / Profile Button */}
        {currentUser ? (
          <div className="relative">
            <button
              id="topbar-user-avatar-btn"
              onClick={() => setShowAuthMenu(!showAuthMenu)}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title="Firebase Cloud Synced"
            >
              <img
                src={currentUser.photoURL || user.avatar}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                {currentUser.displayName?.split(' ')[0] || 'User'}
              </span>
              <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </button>

            {showAuthMenu && (
              <div 
                className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50`}
              >
                <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={currentUser.photoURL || user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.displayName || user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'he' ? 'מסונכרן עם Firestore' : 'Synced to Firestore Cloud'}</span>
                </div>

                <button
                  onClick={() => {
                    signOut();
                    setShowAuthMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'he' ? 'התנתק מחשבון Google' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            id="google-signin-btn"
            onClick={signInWithGoogle}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer"
            title="Sign in with Google to sync Firestore data"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden sm:inline">{language === 'he' ? 'התחבר עם Google' : 'Sign In'}</span>
          </button>
        )}

        {/* Code Mentor AI Button */}
        <button
          id="topbar-mentor-btn"
          onClick={onOpenMentor}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-sm shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t('topbarMentorBtn')}</span>
          <span className="md:hidden">AI</span>
        </button>
      </div>
    </header>
  );
};

