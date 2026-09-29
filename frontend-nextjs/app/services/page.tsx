import { PublicLayout } from "@/components/public/PublicLayout";
import { ServicesContent } from "@/components/public/ServicesContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Nos services", "Services de nettoyage residentiel, commercial, ecologique et specialise.", "/services/");

export default function ServicesPage() {
  return (
    <PublicLayout>
      <ServicesContent />
    </PublicLayout>
  );
}

