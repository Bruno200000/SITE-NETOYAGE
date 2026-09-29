"use client";

import { FaGlobe } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/data/translations";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/8 px-3 py-2 text-sm font-black text-white cursor-pointer">
      <FaGlobe className="text-brand-orange" />
      <span className="sr-only">Langue / Language</span>
      <select
        value={lang}
        onChange={(event) => setLang(event.target.value as Lang)}
        className="bg-transparent text-white outline-none cursor-pointer"
        id="language-switcher"
      >
        <option className="text-slate-900" value="fr">FR</option>
        <option className="text-slate-900" value="en">EN</option>
      </select>
    </label>
  );
}
