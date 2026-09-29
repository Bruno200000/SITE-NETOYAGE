import { PublicLayout } from "@/components/public/PublicLayout";
import { ServiceDetailClient } from "@/components/public/ServiceDetailClient";
import { publicServices } from "@/data/site";

export const dynamicParams = true;

export function generateStaticParams() {
  return publicServices.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  return (
    <PublicLayout>
      <ServiceDetailClient slug={decodedSlug} />
    </PublicLayout>
  );
}
