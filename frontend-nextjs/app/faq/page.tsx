import { PageHero } from "@/components/public/PageHero";
import { PublicFaqList } from "@/components/public/PublicFaqList";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("FAQ", "Questions frequentes sur les services de nettoyage.", "/faq/");

export default function FaqPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.faq} ctaHref="/contact" ctaLabel="Poser une question" />
      <Section eyebrow="FAQ" title="Reponses aux questions frequentes.">
        <PublicFaqList />
      </Section>
    </PublicLayout>
  );
}
