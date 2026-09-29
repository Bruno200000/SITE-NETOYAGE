import { Suspense } from "react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { ServiceDetailFromQuery } from "@/components/public/ServiceDetailFromQuery";
import { PageHero } from "@/components/public/PageHero";
import { serviceImages } from "@/data/site";

export default function ServiceDetailQueryPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<PageHero eyebrow="Service" image={serviceImages["nettoyage-residentiel"]} text="Chargement du service..." title="Service" />}>
        <ServiceDetailFromQuery />
      </Suspense>
    </PublicLayout>
  );
}
