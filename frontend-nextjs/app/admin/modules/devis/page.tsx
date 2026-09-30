"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaCalculator, FaInfoCircle } from "react-icons/fa";

export default function AdminQuotesPage() {
  return (
    <AdminLayout>
      {/* Info banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <FaCalculator className="text-lg" />
          </span>
          <div>
            <h3 className="text-lg font-black text-slate-900">Gestion des demandes de devis</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Toutes les demandes d&apos;estimation de prix envoyées depuis le formulaire public.
              Traitez chaque devis en le modifiant puis en changeant son statut.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Statut «En attente»",
              desc: "Le client attend votre réponse. Prioritaire.",
              dot: "bg-amber-400",
            },
            {
              label: "Statut «Traité»",
              desc: "Vous avez répondu et pris en charge la demande.",
              dot: "bg-emerald-500",
            },
            {
              label: "Statut «Annulé»",
              desc: "Le client a annulé ou la demande n'est plus valide.",
              dot: "bg-slate-400",
            },
          ].map(({ label, desc, dot }) => (
            <div key={label} className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-slate-100 shadow-sm">
              <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${dot}`} />
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">{label}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900/80">
          <FaInfoCircle className="mt-0.5 shrink-0 text-blue-500" />
          <span>
            <strong>Conseil :</strong> Répondez à chaque demande dans les 24h pour maximiser le taux de conversion.
            Vous pouvez appeler directement le client depuis son numéro affiché dans le tableau.
          </span>
        </div>
      </div>

      <CrudTable
        title="Demandes de devis"
        resource="quotes"
        description="Estimations de prix demandées par les clients depuis la page devis. Modifiez le statut pour suivre chaque dossier."
        fields={[
          { name: "name", label: "Nom du client", required: true, placeholder: "Prénom et nom" },
          { name: "email", label: "Adresse e-mail", required: true, type: "email", placeholder: "client@email.com" },
          { name: "phone", label: "Téléphone de contact", required: true, type: "tel", placeholder: "Ex: 506 123 4567" },
          { name: "address", label: "Adresse du lieu à nettoyer", placeholder: "Adresse complète incluant ville et province" },
          { name: "city", label: "Ville / Région", placeholder: "Ex: Moncton, Dieppe, Fredericton..." },
          {
            name: "service_type",
            label: "Type de prestation demandée",
            placeholder: "Ex: Nettoyage résidentiel après déménagement",
          },
          { name: "budget", label: "Budget estimé ou à partir de ($)", placeholder: "Ex: 200-400$, À discuter" },
          { name: "desired_date", label: "Date d'intervention souhaitée", type: "date" },
          {
            name: "message",
            label: "Détails et informations complémentaires",
            type: "textarea",
            placeholder: "Superficie, type de surfaces, présence d'animaux, urgence, accès au logement...",
          },
          {
            name: "status",
            label: "Statut du dossier",
            type: "select",
            options: [
              { label: "⏳ En attente de réponse", value: "pending" },
              { label: "✅ Devis envoyé / Traité", value: "processed" },
              { label: "❌ Annulé", value: "cancelled" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
