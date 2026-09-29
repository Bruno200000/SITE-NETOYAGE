"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type Lang } from "@/data/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "fr",
  setLang: () => undefined,
  t: (key) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = (localStorage.getItem("2jk_language") || "fr") as Lang;
    setLangState(saved);
    document.documentElement.lang = saved;
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem("2jk_language", next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
