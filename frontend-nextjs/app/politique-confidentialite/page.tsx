import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.legal} />
      <Section title="Politique de confidentialite">
        <p className="reveal-up max-w-3xl rounded-lg bg-white p-7 leading-8 text-slate-700 shadow-sm">2JK Services Inc. protege les donnees transmises via ses formulaires et les utilise uniquement pour repondre aux demandes.</p>
      </Section>
    </PublicLayout>
  );
}
