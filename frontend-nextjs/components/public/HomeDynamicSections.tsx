"use client";

import { PublicBeforeAfterList } from "@/components/public/PublicBeforeAfterList";
import { PublicServicesList } from "@/components/public/PublicServicesList";
import { PublicTestimonialsList } from "@/components/public/PublicTestimonialsList";

export function HomeServicesSection() {
  return <PublicServicesList />;
}

export function HomeBeforeAfterSection() {
  return <PublicBeforeAfterList />;
}

export function HomeTestimonialsSection() {
  return <PublicTestimonialsList />;
}
