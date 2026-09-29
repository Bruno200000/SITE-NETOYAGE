"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function WhatsAppButton() {
  const company = useSiteSettings();
  if (!company.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand-green text-3xl text-white shadow-premium transition hover:scale-105"
      aria-label="Contacter sur WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}
