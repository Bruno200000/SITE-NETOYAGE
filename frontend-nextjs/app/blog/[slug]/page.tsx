import { BlogDetailClient } from "@/components/public/BlogDetailClient";
import { PublicLayout } from "@/components/public/PublicLayout";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ slug: "article-1" }, { slug: "article-2" }, { slug: "article-3" }];
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  return (
    <PublicLayout>
      <BlogDetailClient slug={decodedSlug} />
    </PublicLayout>
  );
}
