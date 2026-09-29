import type { Metadata } from "next";
import { company } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function pageMetadata(title: string, description: string, path = "/"): Metadata {
  const fullTitle = `${title} | ${company.name}`;
  const url = `${siteUrl}${path}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: company.name,
      type: "website",
      locale: "fr_CA"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description
    }
  };
}
