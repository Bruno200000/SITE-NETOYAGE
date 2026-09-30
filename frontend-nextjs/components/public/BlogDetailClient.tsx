"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/public/PageHero";
import { Section } from "@/components/public/Section";
import { galleryImages } from "@/data/site";
import { isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList, resolveMediaUrl } from "@/lib/publicApi";

type BlogPost = {
  id?: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  status?: string;
  published_at?: string;
  created_at?: string;
};

const fallbackPosts: BlogPost[] = [
  {
    title: "Comment preparer un grand menage",
    slug: "article-1",
    excerpt: "Les etapes pour organiser efficacement un grand menage.",
    content: "Planifiez les zones, choisissez les bons produits, respectez les temps d'action et validez le resultat avec une checklist.",
    image: galleryImages[1]?.image || galleryImages[0].image,
    status: "published"
  },
  {
    title: "Nettoyage ecologique : les bons reflexes",
    slug: "article-2",
    excerpt: "Des methodes efficaces et responsables pour les espaces sensibles.",
    content: "Les produits responsables, les dosages adaptes et une bonne aeration permettent de nettoyer efficacement tout en protegeant les occupants.",
    image: galleryImages[2]?.image || galleryImages[0].image,
    status: "published"
  },
  {
    title: "Bureaux propres et productivite",
    slug: "article-3",
    excerpt: "Pourquoi un espace propre ameliore l'accueil, la concentration et la confiance.",
    content: "Un entretien regulier des points de contact, sols et espaces communs aide a maintenir un environnement professionnel agreable.",
    image: galleryImages[3]?.image || galleryImages[0].image,
    status: "published"
  }
];

export function BlogDetailClient({ slug }: { slug: string }) {
  const fallback = useMemo(() => fallbackPosts, []);
  const [posts, setPosts] = useState<BlogPost[]>(fallback);

  useEffect(() => {
    let mounted = true;
    fetchPublicList<BlogPost>("posts")
      .then((rows) => {
        if (!mounted) return;
        if (!rows.length) return; // API vide / inaccessible -> garder le fallback
        const published = rows.filter((post) => isPubliclyVisible(post.status, ["published", "active"]));
        // Ne remplacer que si on a du contenu visible, sinon garder le fallback (evite "Article introuvable").
        if (published.length > 0) setPosts(published);
        else setPosts(rows);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const normalize = (s?: string) =>
    decodeURIComponent(s || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-");

  const target = normalize(slug);
  const post =
    posts.find((item) => normalize(item.slug) === target || item.slug === slug || String(item.id) === slug) ||
    fallback.find((item) => normalize(item.slug) === target || item.slug === slug);

  if (!post) {
    return (
      <>
        <PageHero
          eyebrow="Article"
          image={galleryImages[0].image}
          text="Cet article n'est pas disponible pour le moment."
          title="Article introuvable"
          ctaHref="/blog"
          ctaLabel="Retour au blog"
        />
        <Section eyebrow="Blog" title="Consultez les articles publies.">
          <article className="reveal-up rounded-lg bg-white p-8 shadow-premium">
            <p className="leading-7 text-slate-600">Le contenu demande n'est pas encore publie ou a ete desactive.</p>
          </article>
        </Section>
      </>
    );
  }

  const image = resolveMediaUrl(post.image, galleryImages[2].image);
  const excerpt = post.excerpt || "Un guide pratique pour organiser votre nettoyage avec une methode claire.";
  const content = post.content || "Contenu administrable depuis le back-office, avec balises SEO, image et statut de publication.";

  return (
    <>
      <PageHero eyebrow="Article" image={image} text={excerpt} title={post.title} />
      <Section eyebrow="Article" title={post.title}>
        <article className="reveal-up prose max-w-none rounded-lg bg-white p-8 shadow-premium">
          {post.published_at || post.created_at ? <p className="text-sm font-bold text-brand-green">{post.published_at || post.created_at}</p> : null}
          {content.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </Section>
    </>
  );
}
