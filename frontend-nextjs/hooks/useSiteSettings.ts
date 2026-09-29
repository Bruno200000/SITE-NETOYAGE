"use client";

import { useEffect, useMemo, useState } from "react";
import { company } from "@/data/site";

type SettingRow = {
  setting_key: string;
  setting_value: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost/SITE%20NETOYAGE/api";

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    fetch(`${apiBase}/settings`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload) => {
        const rows: SettingRow[] = Array.isArray(payload?.data) ? payload.data : [];
        const next = Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value]));
        if (mounted) setSettings(next);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => ({
    name: settings.company_name || company.name,
    slogan: settings.slogan || company.slogan,
    phone: settings.phone || company.phone,
    whatsapp: settings.whatsapp || company.whatsapp,
    email: settings.email || company.email,
    address: settings.address || company.address,
    zone_intervention: settings.zone_intervention || "Nouveau-Brunswick et regions environnantes",
    facebook: settings.facebook || (company as { facebook?: string }).facebook || "https://www.facebook.com/2jkservices",
    instagram: settings.instagram || (company as { instagram?: string }).instagram || "https://www.instagram.com/2jkservices",
    google_calendar_url: settings.google_calendar_url || (company as { googleCalendarUrl?: string }).googleCalendarUrl || "",
    canada_map_title: settings.canada_map_title || "Couverture & Interventions au Canada",
    canada_map_subtitle: settings.canada_map_subtitle || "Présence active au Nouveau-Brunswick et interventions sur demande",
    canada_map_provinces: settings.canada_map_provinces || "NB,QC,ON,NS,PE",
    canada_map_main_region: settings.canada_map_main_region || "Nouveau-Brunswick (Moncton & environs)",
    canada_map_badge: settings.canada_map_badge || "Intervention 7j/7",
    canada_map_note: settings.canada_map_note || "Des équipes professionnelles mobiles pour projets résidentiels, commerciaux et après travaux.",
    canada_map_color: settings.canada_map_color || "#ff7a1a",
    rawSettings: settings
  }), [settings]);
}
