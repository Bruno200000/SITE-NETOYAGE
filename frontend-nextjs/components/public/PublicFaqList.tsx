"use client";

import { useEffect, useState } from "react";
import { isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList } from "@/lib/publicApi";

type FaqRow = {
  id?: number;
  question: string;
  answer: string;
  display_order?: number;
  status?: string;
};

const fallback: FaqRow[] = [
  {
    question: "Quels secteurs couvrez-vous ?",
    answer: "Nous intervenons au Nouveau-Brunswick et dans les regions environnantes selon les besoins du projet.",
    display_order: 1,
    status: "active"
  },
  {
    question: "Proposez-vous des contrats reguliers ?",
    answer: "Oui, nous adaptons les frequences d'intervention selon vos espaces, horaires et priorites.",
    display_order: 2,
    status: "active"
  },
  {
    question: "Les produits sont-ils fournis ?",
    answer: "Oui, nos equipes peuvent fournir les produits et equipements necessaires a l'intervention.",
    display_order: 3,
    status: "active"
  },
  {
    question: "Comment obtenir un devis ?",
    answer: "Vous pouvez envoyer une demande depuis la page devis avec les details de votre besoin.",
    display_order: 4,
    status: "active"
  }
];

export function PublicFaqList() {
  const [items, setItems] = useState<FaqRow[]>(fallback);

  useEffect(() => {
    let mounted = true;
    fetchPublicList<FaqRow>("faq")
      .then((rows) => {
        if (!mounted) return;
        const active = rows
          .filter((row) => isPubliclyVisible(row.status, ["active", "published"]))
          .sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
        if (rows.length) setItems(active);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <details key={`${item.id || index}-${item.question}`} className="reveal-up rounded-lg bg-white p-5 shadow-sm">
          <summary className="cursor-pointer font-black text-brand-navy">{item.question}</summary>
          <p className="mt-3 text-slate-600">{item.answer}</p>
        </details>
      ))}
      {!items.length ? <p className="rounded-lg bg-white p-6 text-slate-600 shadow-sm">Aucune question publiee pour le moment.</p> : null}
    </div>
  );
}
