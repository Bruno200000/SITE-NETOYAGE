"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList, resolveMediaUrl } from "@/lib/publicApi";

type TestimonialRow = {
  id?: number;
  client_name?: string;
  profession?: string;
  photo?: string;
  rating?: number;
  comment?: string;
  status?: string;
};

const fallback = Array.from({ length: 6 }).map((_, index) => ({
  id: index,
  client_name: "Client verifie",
  comment: "Service professionnel, rapide et tres propre.",
  rating: 5,
  status: "published"
}));

export function PublicTestimonialsList() {
  const [items, setItems] = useState<TestimonialRow[]>(fallback);

  useEffect(() => {
    let mounted = true;
    fetchPublicList<TestimonialRow>("testimonials")
      .then((rows) => {
        if (!mounted) return;
        const published = rows.filter((row) => isPubliclyVisible(row.status, ["published", "active"]));
        // Ne jamais effacer le fallback si l'API ne renvoie rien de visible.
        if (published.length > 0) setItems(published);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item, index) => (
        <blockquote key={`${item.id || index}-${item.client_name}`} className="reveal-up rounded-lg bg-white p-7 shadow-sm">
          {item.photo ? <img src={resolveMediaUrl(item.photo)} alt="" className="mb-5 h-16 w-16 rounded-full object-cover ring-4 ring-brand-mint" /> : null}
          <div className="flex text-brand-green">{Array.from({ length: Number(item.rating || 5) }).map((_, i) => <FaStar key={i} />)}</div>
          <p className="mt-4 text-slate-700">{item.comment || "Service professionnel, rapide et tres propre."}</p>
          <footer className="mt-5 font-bold text-brand-navy">{item.client_name || "Client verifie"}</footer>
          {item.profession ? <p className="mt-1 text-sm text-slate-500">{item.profession}</p> : null}
        </blockquote>
      ))}
      {!items.length ? <p className="rounded-lg bg-white p-6 text-slate-600 shadow-sm md:col-span-3">Aucun temoignage publie pour le moment.</p> : null}
    </div>
  );
}
