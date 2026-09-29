import { FaAward, FaClock, FaLeaf } from "react-icons/fa";
import type { IconType } from "react-icons";
import { Hero } from "@/components/public/Hero";
import { HomeBeforeAfterSection, HomeServicesSection, HomeTestimonialsSection } from "@/components/public/HomeDynamicSections";
import { HowItWorksSection } from "@/components/public/HowItWorksSection";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { ContactForm } from "@/components/public/ContactForm";
import { ZoneInterventionBlock } from "@/components/public/ZoneInterventionBlock";
import { siteImages, stats } from "@/data/site";
import { HomeContent } from "@/components/public/HomeContent";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "2JK Services Inc.",
    areaServed: "Quebec",
    serviceType: "Nettoyage residentiel et commercial"
  };

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <HomeContent />
    </PublicLayout>
  );
}
