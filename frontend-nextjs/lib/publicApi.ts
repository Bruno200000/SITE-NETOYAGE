const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/SITE%20NETOYAGE/api";

function getApiBaseCandidates(): string[] {
  const candidates: string[] = [];
  const push = (value: string | null | undefined) => {
    const clean = (value || "").trim().replace(/\/+$/, "");
    if (clean && !candidates.includes(clean)) candidates.push(clean);
  };

  push(configuredApiUrl);
  if (typeof window !== "undefined") {
    // Si on n'est pas en localhost, l'API est sur le meme hote (Hostinger / prod).
    if (window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      push(`${window.location.protocol}//${window.location.hostname}/SITE%20NETOYAGE/api`);
      push(`${window.location.protocol}//${window.location.hostname}/api`);
    } else {
      // Localhost : essayer le cache en dernier recours + variantes courantes.
      // Le cache peut contenir une vieille URL (ex: http://localhost/api) -> on le garde
      // mais on essaie d'abord l'URL configuree pour eviter de rester bloque sur une 404.
      try {
        push(localStorage.getItem("2jk_api_base"));
      } catch {
        /* stockage indisponible */
      }
      push("http://localhost/SITE%20NETOYAGE/api");
      push("http://127.0.0.1/SITE%20NETOYAGE/api");
      push("http://localhost/api");
    }
  } else {
    push("http://localhost/SITE%20NETOYAGE/api");
  }
  return candidates;
}

function getPublicApiBase() {
  // Base preferee (pour les images). La vraie resilience est dans fetchPublicList
  // qui essaie chaque candidat jusqu'a obtenir une reponse OK.
  return getApiBaseCandidates()[0] || configuredApiUrl.replace(/\/+$/, "");
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
  const bases = getApiBaseCandidates();
  for (const apiBase of bases) {
    try {
      const response = await fetch(`${apiBase}/${resource}`, { cache: "no-store" });
      if (!response.ok) continue; // essayer la base suivante (404/500 = mauvaise URL ou table manquante)
      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      // Memoriser la base qui fonctionne pour les prochains appels
      try {
        if (typeof window !== "undefined") localStorage.setItem("2jk_api_base", apiBase);
      } catch {
        /* stockage indisponible */
      }
      publicListCache.set(resource, { time: Date.now(), data });
      return data as T[];
    } catch {
      continue; // reseau KO sur cette base -> suivante
    }
  }
  return [];
}


export async function fetchPublicItem<T>(resource: string, slug: string): Promise<T | null> {
  try {
    const rows = await fetchPublicList<T & { slug?: string }>(resource);
    return rows.find((row) => row.slug === slug) ?? null;
  } catch {
    return null;
  }
}

