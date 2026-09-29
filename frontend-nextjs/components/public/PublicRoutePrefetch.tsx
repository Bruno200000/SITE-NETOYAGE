"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = [
  "/",
  "/a-propos/",
  "/services/",
  "/galerie/",
  "/avant-apres/",
  "/blog/",
  "/contact/",
  "/devis/",
  "/rendez-vous/",
  "/temoignages/",
  "/faq/",
  "/recrutement/"
];

export function PublicRoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      publicRoutes.forEach((route) => router.prefetch(route));
    }, 800);

    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
