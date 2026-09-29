import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = ["", "a-propos", "services", "galerie", "avant-apres", "blog", "faq", "contact", "devis", "rendez-vous", "paiement", "temoignages", "politique-confidentialite", "mentions-legales", "conditions-utilisation"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return routes.map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
