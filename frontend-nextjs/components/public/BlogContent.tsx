"use client";

import { PageHero } from "@/components/public/PageHero";
import { BlogList } from "@/components/public/BlogList";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export function BlogContent({ fallbackPosts }: { fallbackPosts: any[] }) {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        {...pageHeroes.blog}
        eyebrow={t("blog.hero.eyebrow")}
        title={t("blog.hero.title")}
        text={t("blog.hero.text")}
      />
      <Section eyebrow={t("blog.hero.eyebrow")} title={t("blog.hero.title")}>
        <BlogList fallbackPosts={fallbackPosts} />
      </Section>
    </>
  );
}

export default BlogContent;
