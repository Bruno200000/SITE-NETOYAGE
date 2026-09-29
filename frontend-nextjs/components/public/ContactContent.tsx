"use client";

import { ContactForm } from "@/components/public/ContactForm";
import { ContactInfoCard } from "@/components/public/ContactInfoCard";
import { PageHero } from "@/components/public/PageHero";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export function ContactContent() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        {...pageHeroes.contact}
        eyebrow={t("hero.contact.eyebrow")}
        title={t("hero.contact.title")}
        text={t("hero.contact.text")}
        ctaHref="/devis"
        ctaLabel={t("hero.cta_quote")}
      />
      <Section eyebrow={t("hero.contact.eyebrow")} title={t("hero.contact.title")}>
        <div className="grid gap-8 lg:grid-cols-[1fr_430px]">
          <ContactInfoCard />
          <ContactForm />
        </div>
      </Section>
    </>
  );
}

export default ContactContent;
