"use client";

import { useEffect, useMemo, useState } from "react";
import { FaBroom, FaBuilding, FaHome, FaLeaf, FaShieldAlt, FaSoap, FaSprayCan } from "react-icons/fa";
import type { IconType } from "react-icons";
import { PageHero } from "@/components/public/PageHero";
import { Section } from "@/components/public/Section";
import { Button } from "@/components/ui/Button";
import { publicServices, serviceImages } from "@/data/site";
import { isPubliclyVisible } from "@/lib/publicContent";
import { fetchPublicList, resolveMediaUrl } from "@/lib/publicApi";

type ServiceRow = {
  id?: number;
  title: string;
  slug?: string;
  short_description?: string;
  description?: string;
  image?: string;
  icon?: string;
  status?: string;
};

const icons: Record<string, IconType> = { FaHome, FaBuilding, FaLeaf, FaShieldAlt, FaBroom, FaSprayCan, FaSoap };

function fallbackServices(): ServiceRow[] {
  return publicServices.map((service) => ({
    title: service.title,
    slug: service.slug,
    short_description: service.text,
    description: service.text,
    image: serviceImages[service.slug],
    icon: typeof service.icon === "function" ? service.icon.name || "FaSoap" : "FaSoap",
    status: "active"
  }));
}

export function ServiceDetailClient({ slug }: { slug: string }) {
  const fallback = useMemo(fallbackServices, []);
  const [services, setServices] = useState<ServiceRow[]>(fallback);

  useEffect(() => {
    let mounted = true;
    fetchPublicList<ServiceRow>("services")
      .then((rows) => {
        if (!mounted) return;
        const active = rows.filter((row) => isPubliclyVisible(row.status, ["active", "published"]));
        if (rows.length) setServices(active);
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
  const service =
    services.find((item) => normalize(item.slug) === target || item.slug === slug || String(item.id) === slug) ||
    fallback.find((item) => normalize(item.slug) === target || item.slug === slug);

  if (!service) {
    return (
      <>
        <PageHero
          eyebrow="Service"
          image={serviceImages["nettoyage-residentiel"]}
          text="Ce service n'est pas disponible pour le moment."
          title="Service introuvable"
          ctaHref="/services"
          ctaLabel="Voir les services"
        />
        <Section eyebrow="Services" title="Consultez nos prestations disponibles.">
          <div className="reveal-up rounded-lg bg-white p-8 shadow-premium">
            <p className="leading-7 text-slate-600">Le contenu demande n'est pas encore publie ou a ete desactive.</p>
          </div>
        </Section>
      </>
    );
  }

  const Icon = icons[service.icon || ""] || FaSoap;
  const title = service.title;
  const text = service.short_description || service.description || "Service de nettoyage professionnel.";
  const image = resolveMediaUrl(service.image, serviceImages[service.slug || ""] || serviceImages["nettoyage-residentiel"]);

  return (
    <>
      <PageHero
        eyebrow="Service"
        image={image}
        text={text}
        title={title}
        ctaHref="/devis"
        ctaLabel="Demander un devis"
      />
      <Section eyebrow="Service" title={title}>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <article className="reveal-up rounded-lg bg-white p-8 shadow-premium">
            <Icon className="text-4xl text-brand-blue" />
            <p className="mt-6 text-lg leading-8 text-slate-700">{text}</p>
            {service.description && service.description !== text ? (
              <p className="mt-5 leading-8 text-slate-600">{service.description}</p>
            ) : (
              <p className="mt-5 leading-8 text-slate-600">Nous definissons avec vous les frequences, zones prioritaires, produits, contraintes horaires et criteres de validation afin d'obtenir un service stable et mesurable.</p>
            )}
          </article>
          <aside className="reveal-up rounded-lg bg-brand-navy p-7 text-white">
            <h2 className="text-2xl font-black">Besoin d'un prix ?</h2>
            <p className="mt-3 text-white/78">Envoyez votre demande et recevez une estimation personnalisee.</p>
            <div className="mt-6"><Button href="/devis" variant="secondary">Demander un devis</Button></div>
          </aside>
        </div>
      </Section>
    </>
  );
}
