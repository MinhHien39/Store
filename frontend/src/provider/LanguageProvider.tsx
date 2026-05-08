"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Localized, en, vi } from '@/core/localized';

export type SupportedLanguage = 'en' | 'vi';

const LANG_STORAGE_KEY = 'store_lang';

const localeMap: Record<SupportedLanguage, any> = { en, vi };

const getInitialLanguage = (): SupportedLanguage => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage | null;
        if (stored === 'en' || stored === 'vi') return stored;
    }
    return 'en';
};

interface LanguageContextType {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<SupportedLanguage>(() => {
        const initialLanguage = getInitialLanguage();
        Localized.init(localeMap[initialLanguage], en);
        return initialLanguage;
    });

    useEffect(() => {
        Localized.init(localeMap[language], en);
    }, [language]);

    const setLanguage = (lang: SupportedLanguage) => {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
        Localized.init(localeMap[lang], en);
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
