"use client";

import Link from "next/link";
import { FaArrowRight, FaFacebook, FaInstagram, FaLinkedin, FaLock, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { publicServices } from "@/data/site";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useResource } from "@/hooks/useResource";
import { useLanguage } from "@/context/LanguageContext";

type FooterService = {
  id?: number;
  title: string;
  slug?: string;
  status?: string;
};

export function Footer() {
  const company = useSiteSettings();
  const { t } = useLanguage();
  const fallbackServices: FooterService[] = publicServices.map((service) => ({
    title: service.title,
    slug: service.slug,
    status: "active"
  }));
  const { items: services } = useResource<FooterService>("services", fallbackServices);
  const activeServices = services.filter((service) => String(service.status || "active") === "active").slice(0, 5);
  const whatsappHref = company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, "")}` : "/contact";

  return (
    <footer className="relative overflow-hidden bg-brand-ink text-white">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,122,26,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(22,163,74,0.18),transparent_26%)]" />
      <div className="container-page relative grid gap-10 py-16 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-lg bg-white p-2 shadow-glow">
              <img src="/logo-2jk.jpg" alt="2JK Services Inc." className="h-full w-full object-contain" />
            </span>
            <div>
              <h2 className="text-2xl font-black">{company.name}</h2>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-brand-mint">{t("footer.premium")}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xl leading-7 text-white/70">{company.slogan}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <span className="inline-flex items-center gap-3 rounded-md bg-white/10 px-4 py-3 text-sm font-bold text-white/85">
              <FaPhoneAlt className="text-brand-orange" /> {t("footer.fast_response")}
            </span>
            <span className="inline-flex items-center gap-3 rounded-md bg-white/10 px-4 py-3 text-sm font-bold text-white/85">
              <FaMapMarkerAlt className="text-brand-green" /> {company.zone_intervention}
            </span>
          </div>
          <div className="mt-6 flex gap-3 text-xl text-brand-orange">
            <a className="footer-social" aria-label="Facebook" href={company.facebook || "https://www.facebook.com/2jkservices"} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a className="footer-social" aria-label="Instagram" href={company.instagram || "https://www.instagram.com/2jkservices"} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a className="footer-social" aria-label="WhatsApp" href={whatsappHref} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
          </div>
        </div>
        <div>
          <h3 className="font-bold">{t("footer.navigation")}</h3>
          <div className="mt-4 grid gap-2 text-white/70">
            <Link className="footer-link" href="/a-propos">{t("nav.about")}</Link>
            <Link className="footer-link" href="/services">{t("nav.services")}</Link>
            <Link className="footer-link" href="/avant-apres">{t("nav.before_after")}</Link>
            <Link className="footer-link" href="/galerie">{t("nav.gallery")}</Link>
            <Link className="footer-link" href="/devis">{t("footer.free_quote")}</Link>
            <Link className="footer-link" href="/rendez-vous">{t("nav.appointment")}</Link>
            <Link className="footer-link" href="/paiement">{t("nav.payment")}</Link>
            <Link className="footer-link" href="/blog">{t("nav.blog")}</Link>
            <Link className="footer-link" href="/recrutement">{t("nav.recruitment")}</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">{t("footer.popular_services")}</h3>
          <div className="mt-4 grid gap-2 text-white/70">
            {activeServices.map((service, index) => (
              <Link className="footer-link" href={service.slug ? `/services/detail/?slug=${encodeURIComponent(service.slug)}` : "/services/"} key={`${service.id || index}-${service.slug || service.title}`}>{service.title}</Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold">{t("footer.get_started")}</h3>
          <p className="mt-4 leading-7 text-white/70">{t("footer.get_started_text")}</p>
          <Link href="/devis" className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-orange px-5 py-3 text-sm font-black text-white shadow-glow transition hover:-translate-y-1 hover:bg-orange-600">
            {t("footer.free_quote")} <FaArrowRight />
          </Link>
          <div className="mt-6 rounded-lg border border-white/10 bg-white/8 p-4">
            <h3 className="font-bold">{t("footer.contact")}</h3>
            <p className="mt-3 text-white/70">{company.phone}</p>
            <p className="text-white/70">{company.email}</p>
            <p className="text-white/70">{company.address}</p>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-5 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>Copyright {new Date().getFullYear()} {company.name}. {t("footer.copyright")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link className="footer-link" href="/politique-confidentialite">{t("footer.privacy")}</Link>
            <Link className="footer-link" href="/mentions-legales">{t("footer.legal")}</Link>
            <Link className="footer-link" href="/conditions-utilisation">{t("footer.terms")}</Link>
            <Link href="/admin/login" aria-label="Acces administration" title="Acces administration" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-brand-orange">
              <FaLock />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
