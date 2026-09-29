"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaChevronDown, FaMagic, FaPhoneAlt, FaTimes } from "react-icons/fa";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const company = useSiteSettings();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const primaryNav: [string, string, string][] = [
    [t("nav.home"), "/", "nav-home"],
    [t("nav.services"), "/services", "nav-services"],
    [t("nav.blog"), "/blog", "nav-blog"],
    [t("nav.payment"), "/paiement", "nav-payment"],
    [t("nav.contact"), "/contact", "nav-contact"],
  ];

  const workNav: [string, string, string][] = [
    [t("nav.gallery"), "/galerie", "nav-gallery"],
    [t("nav.before_after"), "/avant-apres", "nav-before-after"],
    [t("nav.testimonials"), "/temoignages", "nav-testimonials"],
    [t("nav.faq"), "/faq", "nav-faq"],
  ];

  const companyNav: [string, string, string][] = [
    [t("nav.about"), "/a-propos", "nav-about"],
    [t("nav.recruitment"), "/recrutement", "nav-recruitment"],
  ];

  return (
    <header className={`site-header fixed left-0 top-0 z-50 w-full border-b text-white backdrop-blur-xl transition-all duration-300 ${scrolled ? "is-scrolled shadow-2xl shadow-slate-950/30" : "shadow-lg shadow-slate-950/10"}`}>
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-xl font-black">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-white p-1 shadow-glow">
            <img src="/logo-2jk.jpg" alt="2JK Services Inc." className="h-full w-full object-contain" />
          </span>
          <span className="leading-tight text-white drop-shadow-sm">
            {company.name}
            <span className="mt-1 hidden items-center gap-1 text-[10px] font-black uppercase tracking-[0.24em] text-brand-mint sm:flex">
              <FaMagic className="text-brand-orange" /> Premium clean
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-3 text-sm font-semibold text-white/90 lg:flex">
          {primaryNav.map(([label, href, id]) => (
            <Link key={href} id={id} href={href} className="nav-link">
              {label}
            </Link>
          ))}

          {/* ---- Dropdown Réalisations ---- */}
          <div className="group relative">
            <button id="nav-realizations" type="button" className="nav-link inline-flex items-center gap-2">
              {t("nav.realizations")} <FaChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {/* pt-2 crée un "pont" invisible pour garder le hover actif */}
            <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <div className="min-w-52 rounded-xl border border-white/10 bg-[#071f49] p-2 shadow-2xl">
                {workNav.map(([label, href, id]) => (
                  <Link key={href} id={id} href={href} className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10 hover:text-white">{label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* ---- Dropdown Entreprise ---- */}
          <div className="group relative">
            <button id="nav-company" type="button" className="nav-link inline-flex items-center gap-2">
              {t("nav.company")} <FaChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <div className="min-w-48 rounded-xl border border-white/10 bg-[#071f49] p-2 shadow-2xl">
                {companyNav.map(([label, href, id]) => (
                  <Link key={href} id={id} href={href} className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10 hover:text-white">{label}</Link>
                ))}
              </div>
            </div>
          </div>

          <Link href={`tel:${company.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/8 px-4 py-2 text-white transition hover:bg-white/15">
            <FaPhoneAlt className="text-brand-orange" /> {t("nav.call")}
          </Link>
          <LanguageSwitcher />
          <Link href="/devis" id="nav-cta-quote" className="rounded-md bg-brand-orange px-5 py-3 font-black text-white shadow-glow transition hover:bg-orange-600">
            {t("nav.free_quote")}
          </Link>
        </nav>
        <button type="button" className="focus-ring rounded-md p-3 text-white lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {open ? (
        <div className="site-mobile-menu border-t border-white/10 lg:hidden">
          <nav className="container-page grid gap-2 py-4">
            {[...primaryNav, ...workNav, ...companyNav].map(([label, href, id]) => (
              <Link key={href} id={`mobile-${id}`} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold text-white/80 hover:bg-white/10">
                {label}
              </Link>
            ))}
            <Link href="/devis" onClick={() => setOpen(false)} className="rounded-md bg-brand-orange px-3 py-3 font-black text-white">
              {t("nav.free_quote")}
            </Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
