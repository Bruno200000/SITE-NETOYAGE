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
  "/paiement/",
  "/contact/",
  "/devis/",
  "/rendez-vous/",
  "/temoignages/",
  "/faq/",
  "/politique-confidentialite/",
  "/mentions-legales/",
  "/conditions-utilisation/",
  "/recrutement/"
];

export function PublicRoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      publicRoutes.forEach((route) => router.prefetch(route));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
