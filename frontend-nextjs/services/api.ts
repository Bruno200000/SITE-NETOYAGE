"use client";

import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import Swal from "sweetalert2";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/SITE%20NETOYAGE/api";
const cachedApiUrl = typeof window !== "undefined" ? localStorage.getItem("2jk_api_base") : null;
const apiBaseCandidates = Array.from(new Set([
  cachedApiUrl || configuredApiUrl,
  configuredApiUrl,
  "http://localhost/SITE%20NETOYAGE/api",
  "http://127.0.0.1/SITE%20NETOYAGE/api"
]));

type RetryConfig = InternalAxiosRequestConfig & {
  _apiFallbackIndex?: number;
};

const listCache = new Map<string, { time: number; data: unknown[] }>();
const LIST_CACHE_TTL = 15000;

export const api = axios.create({
  baseURL: cachedApiUrl || configuredApiUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 8000
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("2jk_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined" && response.config.baseURL) {
      localStorage.setItem("2jk_api_base", response.config.baseURL);
    }
    return response.data;
  },
  async (error) => {
    const config = error.config as RetryConfig | undefined;
    const isNetworkError = !error.response;

    if (isNetworkError && config) {
      const currentIndex = config._apiFallbackIndex ?? apiBaseCandidates.indexOf(String(config.baseURL || configuredApiUrl));
      const nextIndex = currentIndex + 1;
      const nextBaseUrl = apiBaseCandidates[nextIndex];

      if (nextBaseUrl) {
        config._apiFallbackIndex = nextIndex;
        config.baseURL = nextBaseUrl;
        return api.request(config);
      }
    }

    const message = isNetworkError
      ? "API inaccessible. Verifiez que Apache est lance dans XAMPP et que l'URL API correspond au dossier du projet."
      : error.response?.data?.message || "Une erreur est survenue.";

    if (typeof window !== "undefined") {
      Swal.fire({ icon: "error", title: "Erreur", text: message, confirmButtonColor: "#0b63ce" });
    }
    return Promise.reject(new Error(message));
  }
);

export async function getList<T>(resource: string, force = false): Promise<T[]> {
  const cached = listCache.get(resource);
  if (!force && cached && Date.now() - cached.time < LIST_CACHE_TTL) {
    return cached.data as T[];
  }
  const response = await api.get<unknown, { data: T[] }>(`/${resource}`);
  listCache.set(resource, { time: Date.now(), data: response.data as unknown[] });
  return response.data;
}

export function invalidateList(resource: string) {
  listCache.delete(resource);
}

export async function createRecord<T>(resource: string, payload: unknown): Promise<T> {
  const response = await api.post<unknown, { data: T }>(`/${resource}`, payload);
  return response.data;
}
