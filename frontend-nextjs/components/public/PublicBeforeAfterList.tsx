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
        const mapped = rows
          .filter((row) => isPubliclyVisible(row.status, ["active", "published"]) && Number(row.is_before_after || 0) === 1 && row.before_image && row.after_image)
          .map((row) => ({
            title: row.title,
            beforeImage: resolveMediaUrl(row.before_image),
            afterImage: resolveMediaUrl(row.after_image),
            text: row.alt_text || "Resultat avant et apres intervention."
          }));
        if (rows.length) setItems(mapped);
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
