"use client";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaCheckCircle, FaShieldAlt, FaFacebook, FaInstagram } from "react-icons/fa";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CanadaInteractiveMap } from "./CanadaInteractiveMap";

export function ContactInfoCard() {
  const company = useSiteSettings();

  return (
    <div className="reveal-up rounded-2xl bg-gradient-to-b from-[#0b1020] via-[#09152b] to-[#081a38] p-5 md:p-6 text-white shadow-premium border border-blue-900/40 flex flex-col gap-4">
      {/* Top Company Info Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-300 border border-blue-400/30">
            <FaShieldAlt /> Entreprise Certifiée &amp; Assurée
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Équipe disponible aujourd&apos;hui
          </span>
        </div>

        <h2 className="mt-4 text-2xl md:text-3xl font-black text-white tracking-tight">
          {company.name}
        </h2>
        <p className="mt-2 text-sm md:text-base text-blue-100/80 leading-relaxed">
          {company.slogan}
        </p>
      </div>

      {/* Quick Contact Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={`tel:${company.phone.replace(/\s+/g, "")}`}
          className="flex items-center gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/10 transition hover:bg-white/10 hover:border-brand-blue/50"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-blue/20 text-brand-blue text-lg">
            <FaPhoneAlt />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold text-blue-200/70 uppercase">Téléphone direct</span>
            <span className="truncate font-black text-white text-sm">{company.phone}</span>
          </div>
        </a>

        <a
          href={`mailto:${company.email}`}
          className="flex items-center gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/10 transition hover:bg-white/10 hover:border-brand-blue/50"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 text-lg">
            <FaEnvelope />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold text-blue-200/70 uppercase">Courriel</span>
            <span className="truncate font-black text-white text-sm">{company.email}</span>
          </div>
        </a>

        <div className="flex items-center gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/10">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-orange/20 text-brand-orange text-lg">
            <FaMapMarkerAlt />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold text-blue-200/70 uppercase">Localisation principale</span>
            <span className="truncate font-black text-white text-sm">{company.address}</span>
          </div>
        </div>

        {company.whatsapp ? (
          <a
            href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/10 transition hover:bg-emerald-950/40 hover:border-emerald-500/50"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white text-lg">
              <FaWhatsapp />
            </span>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-emerald-300 uppercase">WhatsApp Express</span>
              <span className="truncate font-black text-white text-sm">{company.whatsapp}</span>
            </div>
          </a>
        ) : (
          <div className="flex items-center gap-3.5 rounded-xl bg-white/5 p-3.5 border border-white/10">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-400/20 text-blue-300 text-lg">
              <FaClock />
            </span>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-blue-200/70 uppercase">Horaires</span>
              <span className="truncate font-black text-white text-sm">7j/7 dès 8h00</span>
            </div>
          </div>
        )}
      </div>

      {/* Social links row */}
      <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 border border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-200/80">Réseaux sociaux</span>
        <div className="flex items-center gap-2">
          {company.facebook ? (
            <a
              href={company.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877f2]/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#1877f2]"
            >
              <FaFacebook className="text-base text-[#1877f2]" /> Facebook
            </a>
          ) : null}
          {company.instagram ? (
            <a
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-pink-500/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-pink-600"
            >
              <FaInstagram className="text-base text-pink-400" /> Instagram
            </a>
          ) : null}
        </div>
      </div>

      {/* Interactive Canada Map inside the blue card */}
      <div className="pt-2">
        <CanadaInteractiveMap />
      </div>

      {/* Key Guarantees */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-blue-200/80 border-t border-white/10">
        <span className="inline-flex items-center gap-2">
          <FaCheckCircle className="text-brand-orange" /> Déplacement rapide &amp; ponctuel
        </span>
        <span className="inline-flex items-center gap-2">
          <FaCheckCircle className="text-brand-orange" /> Produits &amp; matériel fournis
        </span>
        <span className="inline-flex items-center gap-2">
          <FaCheckCircle className="text-brand-orange" /> Estimation gratuite sans engagement
        </span>
      </div>
    </div>
  );
}
