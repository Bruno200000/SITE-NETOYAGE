"use client";

import { FaAward, FaClock, FaLeaf } from "react-icons/fa";
import type { IconType } from "react-icons";
import { HomeBeforeAfterSection, HomeServicesSection, HomeTestimonialsSection } from "@/components/public/HomeDynamicSections";
import { HowItWorksSection } from "@/components/public/HowItWorksSection";
import { Section } from "@/components/public/Section";
import { ContactForm } from "@/components/public/ContactForm";
import { ZoneInterventionBlock } from "@/components/public/ZoneInterventionBlock";
import { siteImages, stats } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export function HomeContent() {
  const { t } = useLanguage();

  const reasons: Array<[IconType, string, string]> = [
    [FaAward, t("home.reason1.title"), t("home.reason1.text")],
    [FaClock, t("home.reason2.title"), t("home.reason2.text")],
    [FaLeaf, t("home.reason3.title"), t("home.reason3.text")],
  ];

  const statsData: [string, string][] = [
    ["250+", t("stats.clients")],
    ["98%", t("stats.satisfaction")],
    ["24h", t("stats.response")],
    ["7j/7", t("stats.flexibility")],
  ];

  return (
    <>
      <section className="-mt-12 pb-12">
        <div className="container-page relative z-10 grid gap-4 md:grid-cols-4">
          {statsData.map(([value, label]) => (
            <div key={label} className="reveal-up rounded-lg border border-white/70 bg-white p-6 shadow-premium">
              <strong className="text-4xl font-black text-brand-ink">{value}</strong>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow={t("home.why.eyebrow")} title={t("home.why.title")}>
        <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="reveal-up relative min-h-[460px] overflow-hidden rounded-lg bg-cover bg-center shadow-premium" style={{ backgroundImage: `url(${siteImages.team})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-brand-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <p className="text-sm font-black uppercase tracking-widest text-brand-orange">{t("home.why.team_tag")}</p>
              <h3 className="mt-2 text-3xl font-black">{t("home.why.team_title")}</h3>
            </div>
          </div>
          <div className="grid gap-5">
            {reasons.map(([Icon, title, text]) => (
              <article key={title} className="reveal-up rounded-lg border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
                <Icon className="text-3xl text-brand-orange" />
                <h3 className="mt-5 text-2xl font-black text-brand-ink">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow={t("home.services.eyebrow")} title={t("home.services.title")} tint>
        <HomeServicesSection />
      </Section>

      <HowItWorksSection />

      <Section eyebrow={t("home.before_after.eyebrow")} title={t("home.before_after.title")} tint>
        <HomeBeforeAfterSection />
      </Section>

      <Section eyebrow={t("home.testimonials.eyebrow")} title={t("home.testimonials.title")}>
        <HomeTestimonialsSection />
      </Section>

      <Section eyebrow={t("home.contact.eyebrow")} title={t("home.contact.title")} tint>
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <ZoneInterventionBlock />
          <ContactForm />
        </div>
      </Section>
    </>
  );
}

export default HomeContent;
