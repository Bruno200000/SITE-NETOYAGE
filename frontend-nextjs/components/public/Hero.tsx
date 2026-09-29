"use client";

import { useEffect, useState } from "react";
import { FaArrowRight, FaCalendarCheck, FaCheckCircle, FaFileSignature, FaMagic, FaShieldAlt, FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { heroSlides, siteImages } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const [active, setActive] = useState(0);
  const { t } = useLanguage();
  const slide = heroSlides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  // Slide-specific translations
  const slideTitles = [
    t("slide1.title"),
    t("slide2.title"),
    t("slide3.title"),
    t("slide4.title"),
  ];
  const slideEyebrows = [
    t("slide1.eyebrow"),
    t("slide2.eyebrow"),
    t("slide3.eyebrow"),
    t("slide4.eyebrow"),
  ];
  const slideTexts = [
    slide.text, // slide 1 uses site slogan from settings
    t("slide2.text"),
    t("slide3.text"),
    t("slide4.text"),
  ];

  const badges = [
    t("hero.badge_available"),
    t("hero.badge_team"),
    t("hero.badge_result"),
  ];

  return (
    <section className="hero-banner relative min-h-[calc(100svh-80px)] overflow-hidden bg-brand-ink text-white">
      {heroSlides.map((item, index) => (
        <div
          key={item.title}
          className={`hero-carousel-slide absolute bg-cover bg-center ${index === active ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ))}
      <div className="hero-gradient absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_22%),linear-gradient(120deg,rgba(22,163,74,0.14),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f6f8fb] to-transparent" />

      <button type="button" onClick={() => setActive((current) => (current - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-4 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/10 text-2xl backdrop-blur transition hover:bg-white/20 xl:grid" aria-label={t("hero.prev")}>
        &lsaquo;
      </button>
      <button type="button" onClick={() => setActive((current) => (current + 1) % heroSlides.length)} className="absolute right-4 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/10 text-2xl backdrop-blur transition hover:bg-white/20 xl:grid" aria-label={t("hero.next")}>
        &rsaquo;
      </button>

      <div className="container-page relative flex min-h-[calc(100svh-80px)] items-center justify-center py-14">
        <div key={`${active}-${slide.title}`} className="hero-copy hero-content-fade mx-auto max-w-4xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-orange/35 bg-brand-orange/16 px-5 py-3 text-xs font-black uppercase tracking-wider text-orange-100 backdrop-blur">
            <FaShieldAlt className="text-brand-orange" /> {slideEyebrows[active] || slide.eyebrow}
          </p>
          <h1 className="hero-title mx-auto max-w-4xl text-5xl font-black leading-[0.98] md:text-7xl lg:text-8xl">
            {slideTitles[active] || slide.title}
          </h1>
          <p className="hero-text mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">{slideTexts[active] || slide.text}</p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/devis" icon={FaFileSignature} variant="orange">{t("hero.cta_quote")} <FaArrowRight /></Button>
            <Button href="/rendez-vous" icon={FaCalendarCheck} variant="dark">{t("hero.cta_appointment")}</Button>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 text-sm font-bold text-white/90 sm:grid-cols-3">
            {badges.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-3 backdrop-blur">
                <FaCheckCircle className="text-brand-orange" /> {badge}
              </span>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-3">
            {heroSlides.map((item, index) => (
              <button
                aria-label={`Afficher le slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${index === active ? "w-12 bg-brand-orange" : "w-6 bg-white/35 hover:bg-white/60"}`}
                key={item.title}
                onClick={() => setActive(index)}
                type="button"
              />
            ))}
          </div>
        </div>
        <aside className="floating-panel hero-content-fade absolute right-0 top-1/2 hidden w-[300px] rounded-lg border border-white/20 bg-white/12 p-4 shadow-premium backdrop-blur-xl 2xl:block">
          <div className="overflow-hidden rounded-md">
            <div className="image-zoom h-64 bg-cover bg-center" style={{ backgroundImage: `url(${siteImages.team})` }} />
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md bg-white p-4 text-brand-ink">
              <div className="flex items-center justify-between">
                <FaMagic className="text-brand-orange" />
                <FaStar className="text-brand-green" />
              </div>
              <p className="mt-2 text-sm font-black uppercase tracking-wide text-slate-500">Contrôle qualité</p>
              <p className="mt-1 text-2xl font-black">Avant, pendant, après</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <span className="rounded-md bg-white/14 px-3 py-4 text-sm font-bold text-white">Produits pro</span>
              <span className="rounded-md bg-white/14 px-3 py-4 text-sm font-bold text-white">Suivi rapide</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
