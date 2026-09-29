import { PublicLayout } from "@/components/public/PublicLayout";
import { BlogContent } from "@/components/public/BlogContent";
import { galleryImages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Blog", "Conseils de nettoyage, entretien et hygiene professionnelle.", "/blog/");

const posts = [
  { title: "Comment preparer un grand menage", slug: "article-1", excerpt: "Les etapes pour organiser efficacement un grand menage.", image: galleryImages[1]?.image || galleryImages[0].image, status: "published" },
  { title: "Nettoyage ecologique : les bons reflexes", slug: "article-2", excerpt: "Des methodes efficaces et responsables pour les espaces sensibles.", image: galleryImages[2]?.image || galleryImages[0].image, status: "published" },
  { title: "Bureaux propres et productivite", slug: "article-3", excerpt: "Pourquoi un espace propre ameliore l'accueil, la concentration et la confiance.", image: galleryImages[3]?.image || galleryImages[0].image, status: "published" }
];

export default function BlogPage() {
  return (
    <PublicLayout>
      <BlogContent fallbackPosts={posts} />
    </PublicLayout>
  );
}

