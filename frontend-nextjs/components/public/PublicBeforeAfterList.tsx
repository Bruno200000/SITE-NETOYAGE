"use client";

import { useEffect, useState } from "react";
import { BeforeAfterSlider } from "@/components/public/BeforeAfterSlider";
import { beforeAfterItems } from "@/data/site";
import { isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList, resolveMediaUrl } from "@/lib/publicApi";

type BeforeAfterRow = {
  id?: number;
  title: string;
  image?: string;
  before_image?: string;
  after_image?: string;
  alt_text?: string;
  status?: string;
  is_before_after?: number | string;
};

export function PublicBeforeAfterList() {
  const [items, setItems] = useState(beforeAfterItems);

  useEffect(() => {
    let mounted = true;
    fetchPublicList<BeforeAfterRow>("gallery")
      .then((rows) => {
        if (!mounted) return;
        if (!rows.length) return; // API vide / inaccessible -> garder le fallback
        const mapped = rows
          .filter((row) => isPubliclyVisible(row.status, ["active", "published"]) && Number(row.is_before_after || 0) === 1 && row.before_image && row.after_image)
          .map((row) => ({
            title: row.title,
            beforeImage: resolveMediaUrl(row.before_image),
            afterImage: resolveMediaUrl(row.after_image),
            text: row.alt_text || "Resultat avant et apres intervention."
          }));
        // Ne remplacer que si on a vraiment des avant/apres valides, sinon garder le fallback.
        if (mapped.length > 0) setItems(mapped);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <BeforeAfterSlider key={`${item.title}-${item.beforeImage}`} {...item} />
      ))}
    </div>
  );
}
