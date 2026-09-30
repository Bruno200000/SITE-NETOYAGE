"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaFileInvoiceDollar, FaInfoCircle, FaShieldAlt, FaMoneyBillWave } from "react-icons/fa";

export default function AdminTransactionsPage() {
  return (
    <AdminLayout>
      {/* Info banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/60 via-teal-50/30 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
            <FaFileInvoiceDollar className="text-lg" />
          </span>
          <div>
            <h3 className="text-lg font-black text-slate-900">Suivi des transactions et paiements</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500 max-w-2xl">
              Centralisez les preuves de paiement et confirmations de virement Interac envoyées par vos clients.
              Chaque transaction peut être associée à un numéro de commande ou de devis.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaMoneyBillWave className="mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Virement Interac</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Courriel Interac : <strong>contact@2jkservices.com</strong>. Confirmez la réception en changeant le statut à «Payé».
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaShieldAlt className="mt-0.5 shrink-0 text-blue-500" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Preuve de paiement</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Le client peut téléverser une capture d&apos;écran de son virement via la page /paiement.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <FaInfoCircle className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-[11px] text-blue-900/80">
              <strong>Conseil :</strong> Utilisez le champ «Référence commande» pour lier chaque paiement au numéro de devis correspondant.
            </p>
          </div>
        </div>
      </div>

      <CrudTable
        title="Transactions et paiements"
        resource="payments"
        description="Preuves de paiement envoyées depuis le site et confirmations administratives de virements Interac."
        fields={[
          { name: "reference", label: "Numéro de référence du paiement", placeholder: "Ex: PAY-2024-0042" },
          { name: "order_reference", label: "Lien vers commande / devis", placeholder: "Ex: DEV-2024-0018" },
          { name: "customer_name", label: "Nom du client payeur", required: true, placeholder: "Prénom et nom complet" },
          { name: "customer_email", label: "Adresse e-mail du client", required: true, type: "email", placeholder: "client@email.com" },
          { name: "customer_phone", label: "Téléphone de contact", type: "tel", placeholder: "Ex: 506 234 5678" },
          { name: "amount", label: "Montant reçu ($ CAD)", required: true, type: "number", placeholder: "Ex: 250.00" },
          {
            name: "currency",
            label: "Devise",
            placeholder: "CAD",
          },
          { name: "proof_image", label: "Capture d'écran / Preuve de paiement", type: "image" },
          { name: "proof_note", label: "Notes sur la transaction", type: "textarea", placeholder: "Ex: Virement Interac reçu le 15 oct. Réf. banque: XXXX" },
          {
            name: "status",
            label: "Statut de la transaction",
            type: "select",
            options: [
              { label: "⏳ En attente de paiement", value: "pending" },
              { label: "📋 Preuve reçue (à vérifier)", value: "awaiting_payment" },
              { label: "✅ Payé et confirmé", value: "paid" },
              { label: "❌ Échec / Rejeté", value: "failed" },
              { label: "🚫 Annulé", value: "cancelled" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
