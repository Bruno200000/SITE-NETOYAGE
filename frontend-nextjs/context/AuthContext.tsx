"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { api } from "@/services/api";

type Admin = { id: number; name: string; email: string; role?: string };
type AuthContextValue = {
  admin: Admin | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

type LoginResponse = {
  data?: { token?: string; user?: Admin };
  token?: string;
  user?: Admin;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("2jk_token");
  } catch {
    return null;
  }
}

function readStoredAdmin(): Admin | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("2jk_admin");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Admin;
    if (!parsed || typeof parsed.email !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredSession(token: string | null, admin: Admin | null): void {
  try {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem("2jk_token", token);
    else window.localStorage.removeItem("2jk_token");
    if (admin) window.localStorage.setItem("2jk_admin", JSON.stringify(admin));
    else window.localStorage.removeItem("2jk_admin");
  } catch {
    /* stockage indisponible */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [admin, setAdmin] = useState<Admin | null>(() => readStoredAdmin());

  async function login(email: string, password: string) {
    const response = await api.post<unknown, LoginResponse>("/auth/login", { email, password });
    const loginData = response.data ?? response;
    if (!loginData.token || !loginData.user) {
      throw new Error("Reponse de connexion invalide.");
    }
    writeStoredSession(loginData.token, loginData.user);
    setToken(loginData.token);
    setAdmin(loginData.user);
  }

  function logout() {
    writeStoredSession(null, null);
    setToken(null);
    setAdmin(null);
  }

  const value = useMemo(() => ({ admin, token, isAdmin: admin?.role === "admin", login, logout }), [admin, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
