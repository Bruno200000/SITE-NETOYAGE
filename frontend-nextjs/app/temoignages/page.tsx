import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { PublicTestimonialsList } from "@/components/public/PublicTestimonialsList";
import { Section } from "@/components/public/Section";
import { TestimonialForm } from "@/components/public/TestimonialForm";
import { pageHeroes } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Temoignages", "Avis clients et experiences avec 2JK Services Inc.", "/temoignages/");

export default function TestimonialsPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.testimonials} ctaHref="/contact" ctaLabel="Parler a l'equipe" />
      <Section eyebrow="Temoignages" title="La satisfaction client au centre du service.">
        <PublicTestimonialsList />
      </Section>
      <Section eyebrow="Votre experience" title="Laissez un avis a valider par notre equipe.">
        <TestimonialForm />
      </Section>
    </PublicLayout>
  );
}
