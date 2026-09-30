"use client";

import { useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt,
  FaGoogle,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { AppointmentForm } from "./AppointmentForm";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function AppointmentBookingClient() {
  /* Default tab = "form" so fields are immediately visible */
  const [activeTab, setActiveTab] = useState<"form" | "google">("form");
  const company = useSiteSettings();

  const googleUrl =
    company.google_calendar_url ||
    "https://calendar.google.com/calendar/appointments/schedules/";

  const steps = [
    [FaCalendarCheck, "Créneaux disponibles", "Les jours et heures libres suivent le planning de l’équipe."],
    [FaClock, "Demande enregistrée", "Un créneau réservé est retiré du calendrier pendant le suivi de votre demande."],
    [FaMapMarkerAlt, "Intervention mobile", "Nos équipes se déplacent avec matériel et produits professionnels."],
    [FaShieldAlt, "Confirmation par l’équipe", "Notre équipe valide les détails de l’intervention avec vous."],
  ] as const;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      {/* Left sidebar — advantages */}
      <aside className="space-y-6">
        <div className="rounded-2xl bg-brand-ink p-7 text-white shadow-premium">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-orange">
            <FaGoogle /> Synchronisation Google 24/7
          </div>
          <h2 className="mt-3 text-2xl font-black">Réservation autonome</h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Remplissez le formulaire ci-contre ou réservez directement sur nos créneaux Google Agenda en direct.
          </p>

          <div className="mt-6 grid gap-4">
            {steps.map(([Icon, title, text]) => (
              <div key={title} className="flex gap-4 rounded-xl bg-white/8 p-4 border border-white/5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-orange text-white text-base">
                  <Icon />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/70">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-300">
              <FaCheckCircle /> 100% Mobile &amp; Ponctuel
            </p>
            <p className="mt-1 text-xs leading-5 text-emerald-100/70">
              Résidentiel, commercial, automobile ou après travaux : nous arrivons à l&apos;heure avec tout l&apos;équipement requis.
            </p>
          </div>
        </div>
      </aside>

      {/* Right area with tabs */}
      <div className="space-y-6">
        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition ${
              activeTab === "form"
                ? "bg-white text-brand-ink shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FaCalendarAlt className="text-brand-orange" />
            <span>Formulaire de réservation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("google")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition ${
              activeTab === "google"
                ? "bg-white text-brand-ink shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FaGoogle className="text-brand-orange" />
            <span>Google Agenda (créneaux live)</span>
          </button>
        </div>

        {/* Tab 1 — Custom Appointment Form (default) */}
        {activeTab === "form" && (
          <div id="formulaire-rdv">
            <AppointmentForm />
          </div>
        )}

        {/* Tab 2 — Embedded Google Calendar */}
        {activeTab === "google" && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-premium space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Disponibilités en direct
                </span>
                <h3 className="mt-2 text-2xl font-black text-brand-ink">Calendrier en ligne synchronisé</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Consultez nos créneaux réels et réservez instantanément sans délai de confirmation.
                </p>
              </div>

              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                <span>Ouvrir dans Google Agenda</span>
                <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>

            {/* Google Calendar iframe */}
            <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <iframe
                src={googleUrl}
                title="Calendrier de réservation Google Agenda - 2JK Services"
                className="h-[560px] w-full border-0"
                loading="lazy"
              />
            </div>

            <div className="rounded-xl bg-orange-50/70 p-4 border border-orange-100 text-xs text-orange-950/80 leading-relaxed flex items-start gap-3">
              <FaGoogle className="text-lg text-brand-orange shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-0.5">Comment ça fonctionne ?</strong>
                Sélectionnez la date et l&apos;heure disponible, renseignez votre adresse et type de prestation : le créneau est automatiquement verrouillé dans nos plannings et votre agenda Google ou Apple.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
