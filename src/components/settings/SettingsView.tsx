import React, { useState } from 'react';
import { UserProfile, NavScreen } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  User, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Target, 
  Type, 
  ShieldCheck, 
  Check, 
  AlertTriangle,
  Languages 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { soundFx } from '../../utils/sound';

interface SettingsViewProps {
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
  onUpdateUser: (updater: (prev: UserProfile) => UserProfile) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  isDarkMode,
  onToggleDarkMode,
  onToggleSound,
  onUpdateUser,
  onResetData,
}) => {
  const { t, language, setLanguage, isRtl } = useLanguage();
  const isHe = language === 'he';

  const [nameInput, setNameInput] = useState(user.name);
  const [isSaved, setIsSaved] = useState(false);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    onUpdateUser((prev) => ({ ...prev, name: nameInput.trim() || 'Alex' }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSelectGoal = (minutes: number) => {
    soundFx.playClick();
    onUpdateUser((prev) => ({ ...prev, dailyGoalMinutes: minutes }));
  };

  const handleSelectFontSize = (size: 'sm' | 'md' | 'lg') => {
    soundFx.playClick();
    onUpdateUser((prev) => ({ ...prev, editorFontSize: size }));
  };

  const handleConfirmReset = () => {
    soundFx.playClick();
    setIsConfirmResetOpen(false);
    onResetData();
  };

  return (
    <div id="settings-screen" className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('settingsTitle')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-sm"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Level: {user.level} ({user.xp.toLocaleString()} XP)
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t('settingsDisplayName')}
              </label>
              <input
                id="settings-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Your display name"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                id="save-profile-btn"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {t('buttonSave')}
              </button>
              {isSaved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                  <Check className="w-3.5 h-3.5" /> {isHe ? 'נשמר בהצלחה!' : 'Saved!'}
                </span>
              )}
            </div>
          </form>

          {/* Daily Goal Setting */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('settingsDailyGoal')}
              </h4>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[5, 15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  id={`goal-option-${mins}`}
                  onClick={() => handleSelectGoal(mins)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    user.dailyGoalMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {mins} {isHe ? 'דק׳' : 'mins'}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Font Size */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('settingsEditorFontSize')}
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  id={`fontsize-option-${size}`}
                  onClick={() => handleSelectFontSize(size)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all cursor-pointer ${
                    user.editorFontSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {size === 'sm' ? (isHe ? 'קומפקטי' : 'Compact') : size === 'md' ? (isHe ? 'רגיל' : 'Default') : (isHe ? 'גדול' : 'Large')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appearance, Language & Sound Settings */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {isHe ? 'שפה, מראה וקול' : 'Language, Appearance & Audio'}
          </h4>

          <div className="space-y-3">
            {/* Language Selection */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t('settingsLanguage')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="settings-lang-en-btn"
                  onClick={() => {
                    soundFx.playClick();
                    setLanguage('en');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>{t('settingsEnglish')}</span>
                </button>

                <button
                  id="settings-lang-he-btn"
                  onClick={() => {
                    soundFx.playClick();
                    setLanguage('he');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    language === 'he'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>🇮🇱</span>
                  <span>{t('settingsHebrew')}</span>
                </button>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('settingsDarkMode')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isDarkMode ? (isHe ? 'מצב כהה פעיל' : 'Dark mode enabled') : (isHe ? 'מצב בהיר פעיל' : 'Light mode enabled')}
                  </div>
                </div>
              </div>

              <button
                id="settings-theme-toggle-btn"
                onClick={onToggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isDarkMode ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Audio Effects */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                {user.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('settingsSoundEffects')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {user.soundEnabled ? (isHe ? 'צלילים פועלים' : 'Tactile clicks & chimes') : (isHe ? 'השתק הכל' : 'Muted')}
                  </div>
                </div>
              </div>

              <button
                id="settings-sound-toggle-btn"
                onClick={onToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  user.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    user.soundEnabled ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset Workspace */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              id="reset-progress-trigger-btn"
              onClick={() => setIsConfirmResetOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors w-full justify-center cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('settingsResetProgress')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        title={t('settingsResetProgress')}
        subtitle={isHe ? 'פעולה זו תשחזר את נתוני הדמו הראשוניים של אלכס' : "This will restore Alex's initial 12 completed lessons and 1,240 XP."}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t('settingsResetConfirm')}</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsConfirmResetOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {t('buttonCancel')}
            </button>
            <button
              id="confirm-reset-data-btn"
              onClick={handleConfirmReset}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
            >
              {isHe ? 'אשר איפוס' : 'Confirm Reset'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
