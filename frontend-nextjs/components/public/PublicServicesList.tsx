"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBroom, FaBuilding, FaCar, FaHome, FaLeaf, FaShieldAlt, FaSoap, FaSprayCan } from "react-icons/fa";
import type { IconType } from "react-icons";
import { publicServices, serviceImages } from "@/data/site";
import { byDisplayOrder, isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList, resolveMediaUrl } from "@/lib/publicApi";
import { useLanguage } from "@/context/LanguageContext";

type ServiceRow = {
  id?: number;
  title: string;
  slug?: string;
  short_description?: string;
  description?: string;
  image?: string;
  icon?: string;
  status?: string;
  display_order?: number | string;
};

const icons: Record<string, IconType> = { FaHome, FaBuilding, FaCar, FaLeaf, FaShieldAlt, FaBroom, FaSprayCan, FaSoap };

export function PublicServicesList() {
  const { t } = useLanguage();
  const fallback: ServiceRow[] = publicServices.map((service) => ({
    title: service.title,
    slug: service.slug,
    short_description: service.text,
    image: serviceImages[service.slug],
    icon: typeof service.icon === "function" ? service.icon.name || "FaSoap" : "FaSoap",
    status: "active"
  }));
  const [services, setServices] = useState<ServiceRow[]>(fallback);

  useEffect(() => {
    fetchPublicList<ServiceRow>("services")
      .then((rows) => {
        const active = rows
          .filter((row) => isPubliclyVisible(row.status, ["active", "published"]))
          .sort(byDisplayOrder);
        // Only replace if the API returned actual results
        if (active.length > 0) setServices(active);
        else if (rows.length > 0) setServices(rows.sort(byDisplayOrder)); // lenient fallback
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => {
        const Icon = icons[service.icon || ""] || FaSoap;
        const slug = service.slug || `service-${service.id || index}`;
        const image = resolveMediaUrl(service.image, serviceImages[slug] || fallback[index % fallback.length]?.image || serviceImages["nettoyage-residentiel"]);
        return (
          <Link key={`${service.id || slug}-${service.title}`} href={`/services/detail/?slug=${encodeURIComponent(slug)}`} className="reveal-up group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-premium">
            <div className="relative h-56 overflow-hidden">
              <div className="image-zoom absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/10 to-transparent" />
              <span className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-md bg-white text-brand-orange shadow-premium">
                <Icon className="text-2xl" />
              </span>
            </div>
            <div className="p-7">
              <h2 className="text-xl font-black text-brand-navy">{service.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{service.short_description || service.description || "Service de nettoyage professionnel."}</p>
              <span className="mt-5 inline-flex text-sm font-black uppercase tracking-wide text-brand-orange">{t("services.see")}</span>
            </div>
          </Link>
        );
      })}
      {!services.length ? <p className="rounded-lg bg-white p-6 text-slate-600 shadow-sm md:col-span-2 lg:col-span-3">{t("services.empty")}</p> : null}
    </div>
  );
}
