"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaCalendarAlt, FaCog, FaFacebook, FaInstagram, FaInfoCircle, FaWhatsapp } from "react-icons/fa";

const settingKeys = [
  { icon: FaCog, key: "company_name", label: "Nom de l'entreprise", example: "2JK Services Inc." },
  { icon: FaCog, key: "slogan", label: "Slogan affiché sur le site", example: "Des espaces impeccables, une équipe fiable." },
  { icon: FaCog, key: "phone", label: "Téléphone principal", example: "514 623 5610" },
  { icon: FaWhatsapp, key: "whatsapp", label: "Numéro WhatsApp (avec indicatif)", example: "+15146235610" },
  { icon: FaCog, key: "email", label: "Email de contact / Interac", example: "contact@2jkservices.com" },
  { icon: FaCog, key: "address", label: "Adresse affichée", example: "Nouveau-Brunswick, Canada" },
  { icon: FaCog, key: "zone_intervention", label: "Zone d'intervention", example: "Nouveau-Brunswick & régions environnantes" },
  { icon: FaFacebook, key: "facebook", label: "URL page Facebook", example: "https://www.facebook.com/2jkservices" },
  { icon: FaInstagram, key: "instagram", label: "URL compte Instagram", example: "https://www.instagram.com/2jkservices" },
  { icon: FaCalendarAlt, key: "google_calendar_url", label: "URL Google Agenda (Rendez-vous en ligne)", example: "https://calendar.google.com/calendar/appointments/schedules/VOTRE_ID" },
];

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      {/* Configuration Guide Card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
            <FaInfoCircle className="text-lg" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-brand-navy">Guide des paramètres configurables</h3>
            <p className="mt-1 text-xs text-slate-500 leading-5">
              Utilisez les clés ci-dessous dans le champ <strong>Clé technique</strong> pour modifier les informations affichées sur le site en temps réel.
              <br />
              <strong className="text-brand-orange">⭐ Priorité :</strong> Pour activer le calendrier de réservation en ligne, configurez la clé <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono text-brand-navy">google_calendar_url</code>.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {settingKeys.map(({ icon: Icon, key, label, example }) => (
            <div key={key} className="flex items-start gap-2.5 rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-orange-50 text-brand-orange text-sm">
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">{label}</p>
                <code className="block truncate text-[10px] font-mono text-brand-navy mt-0.5">{key}</code>
                <p className="mt-0.5 truncate text-[10px] text-slate-400 italic">{example}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Google Calendar Setup Help */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700">
            <FaCalendarAlt /> Comment obtenir votre URL Google Agenda ?
          </p>
          <ol className="mt-2 space-y-1 text-xs text-amber-900/80 leading-5 list-decimal list-inside">
            <li>Allez sur <strong>calendar.google.com</strong> et connectez-vous avec votre compte Google professionnel.</li>
            <li>Cliquez sur <strong>+ Créer → Créneaux de rendez-vous</strong>.</li>
            <li>Configurez vos plages horaires, durée et nom du service.</li>
            <li>Copiez le lien de réservation généré et collez-le dans <code className="font-mono bg-amber-100 px-1 rounded">google_calendar_url</code> ci-dessous.</li>
          </ol>
        </div>
      </div>

      <CrudTable
        title="Paramètres du site"
        resource="settings"
        description="Toutes les modifications sont appliquées immédiatement sur le site public après enregistrement."
        fields={[
          { name: "setting_key", label: "Clé technique (ex: phone, email, facebook)", required: true, placeholder: "google_calendar_url" },
          { name: "setting_value", label: "Valeur du paramètre", required: true, type: "textarea", placeholder: "https://..." },
          {
            name: "setting_type",
            label: "Type de valeur",
            type: "select",
            options: [
              { label: "Texte", value: "text" },
              { label: "Téléphone", value: "phone" },
              { label: "Email", value: "email" },
              { label: "URL / Lien", value: "url" },
              { label: "Couleur", value: "color" },
              { label: "Image", value: "image" },
              { label: "SEO", value: "seo" },
              { label: "HTML", value: "html" }
            ]
          }
        ]}
      />
    </AdminLayout>
  );
}
