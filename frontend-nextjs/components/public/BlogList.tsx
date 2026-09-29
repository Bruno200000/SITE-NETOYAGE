"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { galleryImages } from "@/data/site";
import { isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList, resolveMediaUrl } from "@/lib/publicApi";
import { useLanguage } from "@/context/LanguageContext";

type BlogPost = {
  id?: number;
  category_id?: number | string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  status?: string;
  created_at?: string;
};

type BlogCategory = {
  id?: number;
  name: string;
  status?: string;
};

export function BlogList({ fallbackPosts }: { fallbackPosts: BlogPost[] }) {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let mounted = true;
    fetchPublicList<BlogPost>("posts")
      .then((rows) => {
        const published = rows.filter((post) => isPubliclyVisible(post.status, ["published", "active"]));
        // Only replace if we actually got published posts from the API
        if (mounted && published.length > 0) setPosts(published);
        else if (mounted && rows.length > 0 && published.length === 0) {
          // API returned rows but all filtered out → show them anyway (lenient)
          setPosts(rows);
        }
      })
      .catch(() => undefined);
    fetchPublicList<BlogCategory>("blog-categories")
      .then((rows) => {
        const active = rows.filter((item) => isPubliclyVisible(item.status, ["active", "published"]));
        if (mounted) setCategories(active.length > 0 ? active : rows);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery = !term || `${post.title} ${post.excerpt || ""} ${post.content || ""}`.toLowerCase().includes(term);
      const matchesCategory = category === "all" || String(post.category_id || "") === category;
      return matchesQuery && matchesCategory;
    });
  }, [posts, query, category]);

  return (
    <>
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-md border border-slate-200 px-4 py-3 shadow-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
          placeholder={t("blog.search_placeholder")}
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-md border border-slate-200 px-4 py-3 shadow-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
        >
          <option value="all">{t("blog.all_categories")}</option>
          {categories.map((item) => item.id ? <option key={item.id} value={item.id}>{item.name}</option> : null)}
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((post, index) => {
          const image = resolveMediaUrl(post.image, galleryImages[index + 1]?.image || galleryImages[0].image);
          const slug = post.slug || `article-${index + 1}`;
          const categoryName = categories.find((item) => String(item.id || "") === String(post.category_id || ""))?.name || t("blog.default_category");
          return (
            <Link key={`${post.id || slug}-${post.title}`} href={`/blog/article/?slug=${encodeURIComponent(slug)}`} className="reveal-up group overflow-hidden rounded-lg bg-white shadow-premium transition hover:-translate-y-1">
              <div className="image-zoom h-48 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
              <div className="p-6">
                <p className="text-sm font-bold text-brand-green">{categoryName}</p>
                <h2 className="mt-2 text-xl font-black text-brand-navy">{post.title}</h2>
                <p className="mt-3 line-clamp-3 text-slate-600">{post.excerpt || "Un article optimisé SEO avec méthodes simples, image et conseils actionnables."}</p>
              </div>
            </Link>
          );
        })}
        {!filtered.length ? <p className="rounded-lg bg-white p-6 text-slate-600 shadow-sm md:col-span-3">{t("blog.empty")}</p> : null}
      </div>
    </>
  );
}
