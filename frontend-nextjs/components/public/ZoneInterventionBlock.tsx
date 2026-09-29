"use client";

import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function ZoneInterventionBlock() {
  const company = useSiteSettings();
  return (
    <div className="reveal-up rounded-lg bg-brand-ink p-8 text-white shadow-premium">
      <FaMapMarkerAlt className="text-3xl text-brand-orange" />
      <h3 className="mt-5 text-2xl font-black">Zone d&apos;intervention</h3>
      <p className="mt-3 leading-7 text-white/70">{company.zone_intervention}</p>
      <div className="mt-8 grid gap-3">
        {["Devis rapide", "Rendez-vous flexible", "Suivi administrateur"].map((item) => (
          <span key={item} className="inline-flex items-center gap-3 rounded-md bg-white/10 px-4 py-3 font-bold text-white/90">
            <FaCheckCircle className="text-brand-orange" /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
