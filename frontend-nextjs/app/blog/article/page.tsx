import { Suspense } from "react";
import { BlogDetailFromQuery } from "@/components/public/BlogDetailFromQuery";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { galleryImages } from "@/data/site";

export default function BlogArticleQueryPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<PageHero eyebrow="Article" image={galleryImages[0].image} text="Chargement de l'article..." title="Article" />}>
        <BlogDetailFromQuery />
      </Suspense>
    </PublicLayout>
  );
}
