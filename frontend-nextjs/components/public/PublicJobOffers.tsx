"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { fetchPublicList } from "@/lib/publicApi";

export type JobOffer = {
  id?: number;
  title: string;
  slug?: string;
  location?: string;
  contract_type?: string;
  salary?: string;
  short_description?: string;
  description?: string;
  requirements?: string;
  display_order?: number;
  status?: string;
};

const fallbackOffers: JobOffer[] = [
  {
    title: "Agent d'entretien residentiel",
    location: "Nouveau-Brunswick",
    contract_type: "Temps plein / partiel",
    short_description: "Menage de maisons et appartements : depoussierage, sols, salles de bain, cuisines.",
    description: "Menage de maisons et appartements : depoussierage, sols, salles de bain, cuisines. Formation fournie.",
  },
  {
    title: "Technicien nettoyage commercial",
    location: "Nouveau-Brunswick / Moncton",
    contract_type: "Soir / nuit / week-end",
    short_description: "Bureaux, commerces, coproprietes : vitres, sols, sanitaires. Debutants motives acceptes.",
    description: "Bureaux, commerces, coproprietes : vitres, sols, sanitaires. Primes de performance.",
  },
  {
    title: "Chef d'equipe nettoyage",
    location: "Nouveau-Brunswick",
    contract_type: "Temps plein",
    short_description: "Encadrement de 2 a 5 agents, controle qualite, relation client. Experience 1 an exigee.",
    description: "Encadrement de 2 a 5 agents, controle qualite, relation client. Evolution vers superviseur.",
  },
  {
    title: "Candidature spontanee",
    location: "Nouveau-Brunswick",
    contract_type: "Flexible",
    short_description: "Pas d'experience mais ponctuel et soigneux ? Envoyez votre candidature.",
    description: "Pas d'experience mais ponctuel et soigneux ? Envoyez votre candidature, on vous forme.",
  },
];

export function useJobOffers(): { offers: JobOffer[]; loading: boolean } {
  const [offers, setOffers] = useState<JobOffer[]>(fallbackOffers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicList<JobOffer>("job-offers")
      .then((rows) => {
        const active = rows
          .filter((row) => String(row.status || "active") === "active")
          .sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
        if (active.length) setOffers(active);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return { offers, loading };
}

export function PublicJobOffers({ offers, onApply }: { offers: JobOffer[]; onApply?: (title: string) => void }) {
  const list = offers.length ? offers : fallbackOffers;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {list.map((job) => (
        <article
          key={job.slug || job.title}
          className="reveal-up rounded-lg border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-premium"
        >
          <p className="text-xs font-black uppercase tracking-widest text-brand-orange">
            {[job.contract_type, job.location].filter(Boolean).join(" - ") || "Recrutement"}
          </p>
          <h2 className="mt-3 text-xl font-black text-brand-ink">{job.title}</h2>
          <p className="mt-3 leading-7 text-slate-600">{job.short_description || job.description || "Poste a pourvoir."}</p>
          {job.salary ? <p className="mt-2 text-sm font-bold text-slate-500">Salaire : {job.salary}</p> : null}
          <a
            href="#candidature"
            onClick={() => onApply?.(job.title)}
            className="mt-5 inline-flex rounded-md bg-brand-ink px-4 py-2 text-sm font-black text-white transition hover:bg-brand-orange"
          >
            Postuler
          </a>
        </article>
      ))}
    </div>
  );
}

export function PublicJobPerks() {
  const perks = [
    "Formation remuneree des l'embauche",
    "Horaires flexibles (plein / partiel)",
    "Equipement et produits fournis",
    "Primes de performance",
    "Evolution : chef d'equipe / superviseur",
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {perks.map((perk) => (
        <span
          key={perk}
          className="reveal-up inline-flex items-center gap-3 rounded-md bg-white px-4 py-3 font-bold text-brand-ink shadow-sm ring-1 ring-slate-100"
        >
          <FaCheckCircle className="shrink-0 text-brand-green" /> {perk}
        </span>
      ))}
    </div>
  );
}
