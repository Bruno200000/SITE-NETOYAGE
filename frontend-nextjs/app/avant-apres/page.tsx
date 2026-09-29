import { PageHero } from "@/components/public/PageHero";
import { PublicBeforeAfterList } from "@/components/public/PublicBeforeAfterList";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Avant / Apres", "Comparaisons avant apres des nettoyages realises.", "/avant-apres/");

export default function BeforeAfterPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.beforeAfter} ctaHref="/devis" ctaLabel="Demander une transformation" />
      <Section eyebrow="Avant / Apres" title="Comparez les transformations de nos interventions.">
        <PublicBeforeAfterList />
      </Section>
    </PublicLayout>
  );
}
