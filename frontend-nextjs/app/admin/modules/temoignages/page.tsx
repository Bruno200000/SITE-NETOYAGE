"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaStar, FaInfoCircle, FaCheckCircle, FaGoogle } from "react-icons/fa";

export default function AdminTestimonialsPage() {
  return (
    <AdminLayout>
      {/* Info banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50/70 via-amber-50/30 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-yellow-100 text-yellow-600">
            <FaStar className="text-lg" />
          </span>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Gestion des avis et témoignages clients
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500 max-w-2xl">
              Publiez les meilleurs avis clients sur votre site pour renforcer la confiance des nouveaux visiteurs.
              Les témoignages avec statut <strong>«Publié»</strong> apparaissent sur la page publique /temoignages.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Note de 5 étoiles</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Saisissez la note sur 5 (ex: 5 pour cinq étoiles, 4 pour quatre étoiles).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaGoogle className="mt-0.5 shrink-0 text-[#4285F4]" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Avis Google Maps</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Vous pouvez copier-coller les avis laissés sur votre page Google Business.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
            <FaInfoCircle className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-[11px] text-blue-900/80">
              <strong>Astuce :</strong> Mettez les avis à 5 étoiles en premier en utilisant le champ ordre d&apos;affichage.
            </p>
          </div>
        </div>
      </div>

      <CrudTable
        title="Témoignages clients"
        resource="testimonials"
        description="Avis clients, notes et statuts de publication. Seuls les témoignages «Publiés» sont affichés sur le site."
        fields={[
          { name: "client_name", label: "Nom du client", required: true, placeholder: "Ex: Marie Tremblay" },
          { name: "profession", label: "Profession ou type de client", placeholder: "Ex: Propriétaire résidentiel, Gérant commercial..." },
          { name: "photo", label: "Photo ou avatar du client", type: "image" },
          { name: "rating", label: "Note sur 5 étoiles (1 à 5)", type: "number", placeholder: "5" },
          {
            name: "comment",
            label: "Commentaire / Avis complet",
            required: true,
            type: "textarea",
            placeholder: "Ex: Service exceptionnel ! L'équipe était ponctuelle, professionnelle et les résultats dépassent mes attentes...",
          },
          { name: "display_order", label: "Ordre d'affichage (1 = premier)", type: "number", placeholder: "1" },
          {
            name: "status",
            label: "Statut de publication",
            type: "select",
            options: [
              { label: "✅ Publié (visible sur le site)", value: "published" },
              { label: "⏳ En attente de modération", value: "pending" },
              { label: "🚫 Masqué (non visible)", value: "inactive" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
