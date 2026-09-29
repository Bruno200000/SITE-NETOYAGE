"use client";

import Image from "next/image";
import { FaCalendarCheck, FaDoorOpen, FaBroom, FaThumbsUp, FaRedo, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      id: 1,
      number: "1.",
      titleKey: "how.step1.title",
      descKey: "how.step1.desc",
      image: "/illustrations/step1_booking.jpg",
      alt: "Programmez votre nettoyage en ligne",
      icon: FaCalendarCheck,
      tagKey: "how.step1.tag",
    },
    {
      id: 2,
      number: "2.",
      titleKey: "how.step2.title",
      descKey: "how.step2.desc",
      image: "/illustrations/step2_door.jpg",
      alt: "Accès facile et sécurisé",
      icon: FaDoorOpen,
      tagKey: "how.step2.tag",
    },
    {
      id: 3,
      number: "3.",
      titleKey: "how.step3.title",
      descKey: "how.step3.desc",
      image: "/illustrations/step3_cleaning.jpg",
      alt: "Nettoyage professionnel rigoureux",
      icon: FaBroom,
      tagKey: "how.step3.tag",
    },
    {
      id: 4,
      number: "4.",
      titleKey: "how.step4.title",
      descKey: "how.step4.desc",
      image: "/illustrations/step4_feedback.jpg",
      alt: "Votre avis et retour de satisfaction",
      icon: FaThumbsUp,
      tagKey: "how.step4.tag",
    },
    {
      id: 5,
      number: "5.",
      titleKey: "how.step5.title",
      descKey: "how.step5.desc",
      image: "/illustrations/step5_relax.jpg",
      alt: "Nettoyages récurrents en toute sérénité",
      icon: FaRedo,
      tagKey: "how.step5.tag",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#f2f8fd] via-[#eef6fc] to-[#e8f2fa] border-y border-[#dce9f5] overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-white/50 rounded-full blur-3xl" />

      <div className="container-page relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-black uppercase tracking-widest text-white">
            {t("how.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-brand-ink">
            {t("how.title")}
          </h2>
          <p className="mt-3 text-base md:text-lg text-slate-800 font-medium leading-relaxed">
            {t("how.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8 items-stretch">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.id}
                className="group relative flex flex-col h-full rounded-2xl bg-white p-5 text-center shadow-sm border border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
              >
                <div className="relative w-full aspect-square mb-5 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200/60 overflow-hidden flex items-center justify-center">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 200px, 220px"
                    className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-lg bg-brand-ink text-white shadow-md text-xs transition-transform duration-300 group-hover:scale-110">
                    <Icon />
                  </span>
                </div>

                <div className="min-h-[3.25rem] flex items-center justify-center">
                  <h3 className="text-lg md:text-lg font-black text-brand-ink leading-snug">
                    <span className="text-brand-ink font-black mr-1">{step.number}</span>
                    {t(step.titleKey)}
                  </h3>
                </div>

                <div className="flex-1 flex items-start justify-center mt-2 mb-4">
                  <p className="text-sm leading-relaxed text-slate-800 font-normal text-center">
                    {t(step.descKey)}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-ink bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    <Icon className="text-[10px] text-brand-ink" /> {t(step.tagKey)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 md:mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 p-2 bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-4">
            <span className="text-sm font-bold text-slate-900">
              {t("how.cta_text")}
            </span>
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-orange-600 hover:shadow-glow"
            >
              {t("how.cta_btn")} <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
