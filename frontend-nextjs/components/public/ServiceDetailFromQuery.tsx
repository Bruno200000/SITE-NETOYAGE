"use client";

import { useSearchParams } from "next/navigation";
import { ServiceDetailClient } from "@/components/public/ServiceDetailClient";

export function ServiceDetailFromQuery() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  return <ServiceDetailClient slug={slug} />;
}
