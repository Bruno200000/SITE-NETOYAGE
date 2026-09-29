export function shouldProtectAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
}

export function hasAdminToken(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return Boolean(localStorage.getItem("2jk_token"));
}

function readStoredAdminRole(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("2jk_admin");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { role?: string };
    return typeof parsed.role === "string" ? parsed.role : null;
  } catch {
    return null;
  }
}

export function isStoredAdmin(): boolean {
  return readStoredAdminRole() === "admin";
}
