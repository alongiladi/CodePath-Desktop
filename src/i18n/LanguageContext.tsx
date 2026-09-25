import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppLanguage } from '../types';
import { enTranslations, heTranslations, TranslationKey } from './translations';

interface LanguageContextType {
  language: AppLanguage;
  isRtl: boolean;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'codepath_language_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'he' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    // Check browser languages
    if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('he')) {
      return 'he';
    }
    return 'en';
  });

  const isRtl = language === 'he';

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // ignore
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    }
  }, [language, isRtl]);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'he' : 'en'));
  }, []);

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>): string => {
    const dict = language === 'he' ? heTranslations : enTranslations;
    let text = dict[key] || enTranslations[key] || String(key);
    
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, isRtl, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
