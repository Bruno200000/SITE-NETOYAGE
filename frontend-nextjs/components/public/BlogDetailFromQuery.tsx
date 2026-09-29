"use client";

import { useSearchParams } from "next/navigation";
import { BlogDetailClient } from "@/components/public/BlogDetailClient";

export function BlogDetailFromQuery() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  return <BlogDetailClient slug={slug} />;
}
