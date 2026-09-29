import { ContactForm } from "@/components/public/ContactForm";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Demande de devis", "Demandez un devis de nettoyage personnalise.", "/devis/");

export default function QuotePage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.quote} />
      <Section eyebrow="Devis" title="Decrivez votre besoin, nous preparons une estimation claire.">
        <div className="mx-auto max-w-2xl">
          <ContactForm endpoint="quotes" />
        </div>
      </Section>
    </PublicLayout>
  );
}
