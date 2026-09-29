"use client";

import { useEffect, useState } from "react";
import { galleryImages } from "@/data/site";
import { byDisplayOrder, isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList, resolveMediaUrl } from "@/lib/publicApi";

type GalleryRow = {
  id?: number;
  title: string;
  image?: string;
  alt_text?: string;
  status?: string;
  is_before_after?: number | string;
  display_order?: number | string;
};

export function PublicGalleryGrid() {
  const fallback: GalleryRow[] = galleryImages.map((item) => ({ title: item.title, image: item.image, alt_text: item.category, status: "active" }));
  const [items, setItems] = useState<GalleryRow[]>(fallback);

  useEffect(() => {
    let mounted = true;
    fetchPublicList<GalleryRow>("gallery")
      .then((rows) => {
        if (!mounted) return;
        const active = rows.filter((row) => isPubliclyVisible(row.status, ["active", "published"]) && row.image).sort(byDisplayOrder);
        if (rows.length) setItems(active);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid auto-rows-[260px] gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <article key={`${item.id || index}-${item.title}`} className={`reveal-up group relative overflow-hidden rounded-lg bg-brand-ink shadow-sm ${index === 0 || index === 4 ? "md:col-span-2" : ""}`}>
          <div className="image-zoom absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${resolveMediaUrl(item.image, fallback[index % fallback.length]?.image)})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange">{item.alt_text || "Realisation"}</p>
            <h2 className="mt-2 text-2xl font-black">{item.title}</h2>
          </div>
        </article>
      ))}
      {!items.length ? <p className="rounded-lg bg-white p-6 text-slate-600 shadow-sm md:col-span-3">Aucune image publiee pour le moment.</p> : null}
    </div>
  );
}
