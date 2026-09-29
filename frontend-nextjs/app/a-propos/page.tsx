import { FaCheckCircle } from "react-icons/fa";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes, siteImages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("A propos", "Decouvrez l'equipe et les engagements de 2JK Services Inc.", "/a-propos/");

const values = ["Equipes formees", "Produits adaptes", "Communication rapide", "Controle qualite"];

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.about} ctaHref="/contact" ctaLabel="Nous contacter" />
      <Section eyebrow="A propos" title="Une entreprise de nettoyage batie sur la confiance, la rigueur et la transparence.">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal-up relative min-h-[520px] overflow-hidden rounded-lg bg-cover bg-center shadow-premium" style={{ backgroundImage: `url(${siteImages.team})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-7 text-white">
              <p className="text-sm font-black uppercase tracking-widest text-brand-orange">2JK Services Inc.</p>
              <h2 className="mt-2 text-3xl font-black">Une equipe fiable pour vos espaces de vie et de travail.</h2>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="reveal-up rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-100">
              <p className="text-lg leading-8 text-slate-700">2JK Services Inc. accompagne les particuliers, commerces et gestionnaires d'immeubles avec des prestations claires, suivies et adaptees a chaque environnement.</p>
              <p className="mt-5 text-lg leading-8 text-slate-700">Notre approche combine checklists qualite, equipes formees, produits efficaces et communication rapide pour offrir une experience simple et professionnelle.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {values.map((value) => (
                  <span key={value} className="inline-flex items-center gap-3 rounded-md bg-brand-sky px-4 py-3 font-bold text-brand-ink">
                    <FaCheckCircle className="text-brand-green" /> {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
}
