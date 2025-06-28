import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageCode } from '@/constants/Languages';
import * as Localization from 'expo-localization';

export interface LanguageContextType {
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
  language: string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  currentLanguage: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export { LanguageContext }; // Export LanguageContext

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    // Auto-detect device locale on app start
    const deviceLocale = Localization.locale;
    const localeCode = deviceLocale.split('-')[0].toLowerCase();

    // Map device locale to supported languages
    const languageMap: { [key: string]: LanguageCode } = {
      'zu': 'zu',
      'af': 'af',
      'xh': 'xh',
      'ts': 'ts',
      'nso': 'nso',
      'tn': 'tn',
      've': 've',
      'en': 'en',
    };

    const detectedLanguage = languageMap[localeCode] || 'en';
    setLanguage(detectedLanguage);
  }, []);

  const t = (key: string): string => {
    const languageTranslations = TRANSLATIONS[language];
    if (!languageTranslations) {
      console.warn(`Language not supported: ${language}`);
      return TRANSLATIONS.en[key as keyof typeof TRANSLATIONS.en] || key;
    }
    
    const translation = languageTranslations[key as keyof typeof languageTranslations];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return TRANSLATIONS.en[key as keyof typeof TRANSLATIONS.en] || key;
    }
    return translation;
  };

  // Interface removed as it's already defined above

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang as LanguageCode);
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage: language,
      language: language, 
      setLanguage: handleSetLanguage, 
      t, 
      supportedLanguages: SUPPORTED_LANGUAGES 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}


export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Safe language hook that provides fallback values
export function useLanguageSafe() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return fallback language context when not available
    return {
      t: (key: string) => key,
      setLanguage: () => {},
      language: 'en',
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguage: 'en',
    };
  }
  return context;
}

// Remove this duplicate interface as it's already defined above
// For backward compatibility
export type Language = LanguageCode;