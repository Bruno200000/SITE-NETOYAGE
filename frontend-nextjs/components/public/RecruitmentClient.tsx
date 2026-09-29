"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { PublicJobOffers, PublicJobPerks, useJobOffers } from "@/components/public/PublicJobOffers";
import { RecruitmentForm } from "@/components/public/RecruitmentForm";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";

export function RecruitmentClient() {
  const { offers } = useJobOffers();
  const [selectedJob, setSelectedJob] = useState<string>(() => offers[0]?.title || "");
  const hero = pageHeroes.recruitment;

  useEffect(() => {
    if (!selectedJob && offers.length > 0) {
      setSelectedJob(offers[0].title);
    }
  }, [offers, selectedJob]);

  return (
    <PublicLayout>
      <PageHero {...hero} ctaHref="#candidature-spontanee" ctaLabel="Candidature spontanée" />

      {/* Bannière standard Candidature Spontanée */}
      <section id="candidature-spontanee" className="container-page py-8 scroll-mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-ink p-8 md:p-10 text-white shadow-premium">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-orange">
                ✦ Candidature spontanée
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-black text-white">
                Votre profil nous intéresse !
              </h2>
              <p className="mt-2 text-sm md:text-base leading-relaxed text-white/80">
                Vous ne trouvez pas de poste qui correspond exactement à votre recherche ? Chez <strong>2JK Services Inc.</strong>, nous recrutons en continu des agents motivés, ponctuels et sérieux pour nos interventions mobiles au Nouveau-Brunswick et partout au Canada.
              </p>
            </div>

            <a
              href="#candidature"
              onClick={() => setSelectedJob("Candidature spontanée")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-4 text-sm font-black text-white shadow-glow transition hover:bg-orange-600 hover:-translate-y-1"
            >
              Remplir le formulaire
            </a>
          </div>
        </div>
      </section>

      <Section eyebrow="Postes ouverts" title="Choisissez le poste qui vous correspond.">
        <PublicJobOffers offers={offers} onApply={(title) => setSelectedJob(title)} />
      </Section>
      <Section eyebrow="Pourquoi nous" title="Une entreprise qui investit dans ses équipes." tint>
        <PublicJobPerks />
      </Section>
      <Section eyebrow="Candidature" title="Deposez votre candidature en 2 minutes.">
        <div id="candidature" className="mx-auto max-w-2xl scroll-mt-28">
          <RecruitmentForm
            jobs={offers.map((job) => job.title)}
            defaultPosition={selectedJob}
            onJobChange={setSelectedJob}
          />
        </div>
      </Section>
    </PublicLayout>
  );
}
