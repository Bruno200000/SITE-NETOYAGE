/**
 * Returns true if the given status is considered publicly visible.
 * A null/undefined/empty status is treated as the first allowed value (active).
 */
export function isPubliclyVisible(status: unknown, allowed: string[] = ["active", "published"]): boolean {
  if (status === null || status === undefined || status === "") return true;
  const value = String(status).toLowerCase().trim();
  return allowed.map((s) => s.toLowerCase()).includes(value);
}

export function byDisplayOrder<T extends { display_order?: number | string; id?: number | string }>(a: T, b: T): number {
  const orderA = Number(a.display_order ?? a.id ?? 0);
  const orderB = Number(b.display_order ?? b.id ?? 0);
  return orderA - orderB;
}

