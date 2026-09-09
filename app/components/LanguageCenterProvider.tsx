"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { lcTranslations, LCLanguage } from "@/lib/languageCenterTranslations";

type LCContextType = {
  language: LCLanguage;
  setLanguage: (lang: LCLanguage) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  t: typeof lcTranslations[LCLanguage];
};

const LCContext = createContext<LCContextType | undefined>(undefined);

export function LanguageCenterProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LCLanguage>("fr");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Restore preferences from localStorage
    const savedLang = localStorage.getItem("lc-language") as LCLanguage;
    if (savedLang === "fr" || savedLang === "en") {
      setLanguageState(savedLang);
    }
    const savedDark = localStorage.getItem("lc-dark-mode");
    if (savedDark === "true") {
      setDarkMode(true);
    }
  }, []);

  const setLanguage = (lang: LCLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("lc-language", lang);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("lc-dark-mode", String(next));
      return next;
    });
  };

  return (
    <LCContext.Provider
      value={{
        language,
        setLanguage,
        darkMode,
        toggleDarkMode,
        t: lcTranslations[language],
      }}
    >
      {children}
    </LCContext.Provider>
  );
}

export function useLanguageCenter() {
  const ctx = useContext(LCContext);
  if (!ctx) {
    throw new Error("useLanguageCenter must be used within LanguageCenterProvider");
  }
  return ctx;
}
