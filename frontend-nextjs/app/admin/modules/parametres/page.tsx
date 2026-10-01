"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaBookOpen, FaCheckCircle, FaCog, FaImage, FaUsers, FaCalendarAlt, FaSave } from "react-icons/fa";


export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <section className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
            <FaBookOpen className="text-lg" />
          </span>
          <div>
            <h2 className="text-lg font-black text-brand-navy">Guide de l&apos;administration</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Utilisez ce panneau pour gérer le contenu du site et suivre les demandes de vos clients.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            [FaCheckCircle, "Tableau de bord", "Consultez rapidement les statistiques et les dernières demandes."],
            [FaCog, "Services", "Ajoutez ou modifiez les prestations, descriptions, prix et statuts de publication."],
            [FaImage, "Galerie / Avant-Après", "Ajoutez les photos avant et après, puis publiez uniquement les réalisations terminées."],
            [FaUsers, "Recrutement", "Consultez les candidatures reçues et ouvrez les CV transmis par les candidats."],
            [FaCalendarAlt, "Rendez-vous", "Gérez les disponibilités et consultez les demandes de rendez-vous des clients."],
            [FaSave, "Enregistrer", "Après chaque modification, cliquez sur Enregistrer et vérifiez le message de confirmation."],
          ].map(([Icon, title, description]) => (
            <div key={String(title)} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-black text-brand-navy">
                <span className="text-brand-orange"><Icon /></span>
                {title}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
          <strong>Conseil :</strong> utilisez des images nettes, des titres courts et vérifiez le statut « Publié » avant de quitter la page.
        </div>
      </section>
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
