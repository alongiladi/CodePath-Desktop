import React from 'react';
import { NavScreen } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  LayoutDashboard, 
  Compass, 
  Terminal, 
  Layers,
  Award,
  Trophy 
} from 'lucide-react';

interface BottomNavProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onOpenMentor?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { t } = useLanguage();

  const items: { screen: NavScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { screen: 'courses', label: t('navCourses'), icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { screen: 'practice', label: t('navPractice'), icon: <Terminal className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { screen: 'architecture', label: t('navArchitecture'), icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { screen: 'leaderboard', label: t('navLeaderboard'), icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { screen: 'achievements', label: t('navAchievements'), icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around"
    >
      {items.map((item) => {
        const isActive = currentScreen === item.screen;
        return (
          <button
            key={item.screen}
            id={`bottom-nav-${item.screen}`}
            onClick={() => onNavigate(item.screen)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-colors min-w-[50px] min-h-[48px] cursor-pointer ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/80' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5 leading-none truncate max-w-[58px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

