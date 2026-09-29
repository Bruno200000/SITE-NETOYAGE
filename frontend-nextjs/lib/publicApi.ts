const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/SITE%20NETOYAGE/api";

function getPublicApiBase() {
  let base = configuredApiUrl;
  if (typeof window !== "undefined") {
    if (window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      base = `${window.location.protocol}//${window.location.hostname}/SITE%20NETOYAGE/api`;
    } else {
      const cached = localStorage.getItem("2jk_api_base");
      if (cached && cached.trim()) base = cached.trim();
    }
  }
  return base.replace(/\/+$/, "");
}

const publicListCache = new Map<string, { time: number; data: unknown[] }>();
const PUBLIC_LIST_CACHE_TTL = 3000;

export function resolveMediaUrl(value: string | undefined, fallback = ""): string {
  if (!value) return fallback;
  if (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:")) return value;
  const base = getPublicApiBase();
  return `${base.replace(/\/$/, "")}/${value.replace(/^\/+/, "")}`;
}

export function invalidatePublicCache(resource?: string) {
  if (resource) publicListCache.delete(resource);
  else publicListCache.clear();
}

export async function fetchPublicList<T>(resource: string, force = false): Promise<T[]> {
  if (!force) {
    const cached = publicListCache.get(resource);
    if (cached && Date.now() - cached.time < PUBLIC_LIST_CACHE_TTL) {
      return cached.data as T[];
    }
  }
  const apiBase = getPublicApiBase();
  try {
    const response = await fetch(`${apiBase}/${resource}`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    publicListCache.set(resource, { time: Date.now(), data });
    return data as T[];
  } catch {
    return [];
  }
}


export async function fetchPublicItem<T>(resource: string, slug: string): Promise<T | null> {
  try {
    const rows = await fetchPublicList<T & { slug?: string }>(resource);
    return rows.find((row) => row.slug === slug) ?? null;
  } catch {
    return null;
  }
}

