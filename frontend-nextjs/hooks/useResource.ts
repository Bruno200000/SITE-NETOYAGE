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
      .then((data) => mounted && setItems(Array.isArray(data) ? data : fallback))
      .catch(() => mounted && setItems(fallback))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  return { items, loading, setItems };
}
