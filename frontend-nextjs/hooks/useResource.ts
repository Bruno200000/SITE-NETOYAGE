"use client";

import { useEffect, useState } from "react";
import { getList } from "@/services/api";

export function useResource<T>(resource: string, fallback: T[] = []) {
  const [items, setItems] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getList<T>(resource)
      .then((data) => {
        if (!mounted) return;
        // Ne jamais vider le fallback si l'API renvoie vide (ex: footer services).
        // La base MySQL remplace l'affichage seulement quand elle renvoie du contenu.
        if (Array.isArray(data) && data.length > 0) setItems(data);
        else if (!Array.isArray(data)) setItems(fallback);
      })
      .catch(() => mounted && setItems(fallback))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  return { items, loading, setItems };
}
