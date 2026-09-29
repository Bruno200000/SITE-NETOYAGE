"use client";

import { PageHero } from "@/components/public/PageHero";
import { PublicServicesList } from "@/components/public/PublicServicesList";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export function ServicesContent() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        {...pageHeroes.services}
        eyebrow={t("services.hero.eyebrow")}
        title={t("services.hero.title")}
        text={t("services.hero.text")}
        ctaHref="/devis"
        ctaLabel={t("services.cta_label")}
      />
      <Section eyebrow={t("services.page.eyebrow")} title={t("services.page.title")}>
        <PublicServicesList />
      </Section>
    </>
  );
}

export default ServicesContent;
