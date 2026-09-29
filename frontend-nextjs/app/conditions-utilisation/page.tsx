import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";

export default function TermsPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.legal} />
      <Section title="Conditions d'utilisation">
        <p className="reveal-up max-w-3xl rounded-lg bg-white p-7 leading-8 text-slate-700 shadow-sm">L'utilisation du site implique l'acceptation des presentes conditions et des regles de confidentialite.</p>
      </Section>
    </PublicLayout>
  );
}
