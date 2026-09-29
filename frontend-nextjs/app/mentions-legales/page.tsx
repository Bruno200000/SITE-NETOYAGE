import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";

export default function LegalPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.legal} />
      <Section title="Mentions legales">
        <p className="reveal-up max-w-3xl rounded-lg bg-white p-7 leading-8 text-slate-700 shadow-sm">Informations legales de 2JK Services Inc., coordonnees, hebergement et responsabilites editoriales.</p>
      </Section>
    </PublicLayout>
  );
}
