import { PageHero } from "@/components/public/PageHero";
import { PublicGalleryGrid } from "@/components/public/PublicGalleryGrid";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Galerie", "Galerie de realisations et albums de nettoyage.", "/galerie/");

export default function GalleryPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.gallery} ctaHref="/avant-apres" ctaLabel="Voir avant / apres" />
      <Section eyebrow="Galerie" title="Des realisations recentes, visibles et soignees.">
        <PublicGalleryGrid />
      </Section>
    </PublicLayout>
  );
}
