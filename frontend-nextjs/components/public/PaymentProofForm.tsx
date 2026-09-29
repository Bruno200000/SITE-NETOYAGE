"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaBuilding, FaCheckCircle, FaCreditCard, FaFileInvoiceDollar, FaInfoCircle, FaLock, FaPaperPlane, FaShieldAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { createRecord } from "@/services/api";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const notifySchema = z.object({
  customer_name: z.string().min(2, "Nom complet requis"),
  customer_email: z.string().email("Adresse courriel valide requise"),
  customer_phone: z.string().min(6, "Numéro de téléphone requis"),
  order_reference: z.string().min(2, "Numéro de facture ou référence requis (ex. 2JK-104)"),
  amount: z.string().min(1, "Montant payé requis"),
  proof_note: z.string().optional()
});

type NotifyInput = z.infer<typeof notifySchema>;

export function PaymentProofForm() {
  const company = useSiteSettings();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NotifyInput>({
    resolver: zodResolver(notifySchema)
  });

  const interacEmail = company.email || "paiement@2jkservices.com";

  function copyInteracEmail() {
    navigator.clipboard.writeText(interacEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  }

  async function onNotifySubmit(values: NotifyInput) {
    try {
      await createRecord("payments", {
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
        reference: values.order_reference,
        amount: Number(values.amount) || 0,
        proof_note: values.proof_note || "Notification de paiement envoyée par le client",
        status: "pending"
      });

      reset();
      Swal.fire({
        icon: "success",
        title: "Paiement notifié avec succès !",
        text: "Notre service comptabilité va rapprocher votre virement et vous transmettre votre reçu officiel acquitté.",
        confirmButtonColor: "#ff7a1a"
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Transmission impossible",
        text: "Veuillez vérifier vos informations ou nous contacter directement.",
        confirmButtonColor: "#ff7a1a"
      });
    }
  }

  const fieldClass = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100";
  const labelClass = "block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5";

  return (
    <div className="space-y-10">
      {/* 3 Steps Guide */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-ink p-7 text-white shadow-premium">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-orange">
          <FaShieldAlt /> Processus transparent
        </span>
        <h2 className="mt-3 text-2xl font-black">Comment fonctionne le règlement de vos prestations ?</h2>
        <p className="mt-2 text-sm text-white/75 max-w-2xl leading-relaxed">
          Chez 2JK Services Inc., vous ne payez rien à l&apos;aveugle. Chaque intervention fait l&apos;objet d&apos;une estimation claire et d&apos;une facture détaillée.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-4 border border-white/10">
            <span className="text-xl font-black text-brand-orange">01.</span>
            <h3 className="mt-1 font-bold text-sm">Devis &amp; Intervention</h3>
            <p className="mt-1 text-xs text-white/70">Validation de la prestation selon vos besoins et passage de nos équipes.</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 border border-white/10">
            <span className="text-xl font-black text-brand-orange">02.</span>
            <h3 className="mt-1 font-bold text-sm">Facture officielle</h3>
            <p className="mt-1 text-xs text-white/70">Émission d&apos;une facture avec référence unique et détail des taxes canadiennes.</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 border border-white/10">
            <span className="text-xl font-black text-brand-orange">03.</span>
            <h3 className="mt-1 font-bold text-sm">Paiement sécurisé</h3>
            <p className="mt-1 text-xs text-white/70">Règlement par virement Interac, carte ou modalité d&apos;entreprise sous 30 jours.</p>
          </div>
        </div>
      </div>

      {/* Methods of Payment Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Interac e-Transfer */}
        <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-white p-6 shadow-premium flex flex-col justify-between">
          <span className="absolute -top-3 right-4 rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-black uppercase text-white shadow-sm">
            Méthode n°1 au Canada
          </span>
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 text-2xl mb-4">
              <FaFileInvoiceDollar />
            </div>
            <h3 className="text-xl font-black text-brand-navy">Virement Interac</h3>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              Virement direct et sécurisé depuis l&apos;application de votre banque canadienne (RBC, TD, Desjardins, Scotia, BMO, etc.).
            </p>

            <div className="mt-4 rounded-xl bg-emerald-50/60 p-3.5 border border-emerald-100 text-xs">
              <span className="block font-bold text-emerald-950 uppercase text-[10px] tracking-wider">Courriel pour le virement :</span>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <code className="font-bold text-emerald-800 text-sm truncate">{interacEmail}</code>
                <button
                  type="button"
                  onClick={copyInteracEmail}
                  className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                >
                  {copiedEmail ? "Copié !" : "Copier"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-emerald-900/80 font-medium">
                ✅ <strong>Dépôt direct actif :</strong> Aucun mot de passe ni question de sécurité requis.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Pensez à inscrire votre numéro de facture ou votre nom en note du virement.
          </div>
        </div>

        {/* Card 2: Credit Card & Terminal */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 text-2xl mb-4">
              <FaCreditCard />
            </div>
            <h3 className="text-xl font-black text-brand-navy">Carte Bancaire</h3>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              Paiement direct par carte de crédit ou débit Visa, MasterCard et American Express.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-brand-orange shrink-0" />
                <span><strong>Sur place :</strong> Nos techniciens disposent de terminaux de paiement sécurisés.</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-brand-orange shrink-0" />
                <span><strong>Lien sécurisé :</strong> Lien de règlement par carte inclus dans votre courriel de facture.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <FaLock className="text-slate-400" /> Transactions chiffrées SSL 256 bits.
          </div>
        </div>

        {/* Card 3: Corporate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-brand-orange text-2xl mb-4">
              <FaBuilding />
            </div>
            <h3 className="text-xl font-black text-brand-navy">Comptes Commerciaux</h3>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              Modalités de facturation adaptées aux entreprises, bureaux, syndics de copropriété et chantiers.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span>Modalités net 30 jours pour contrats réguliers</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span>Transfert bancaire TEF / Dépôt direct d&apos;entreprise</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span>Chèque corporatif accepté sous entente</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Factures conformes aux normes fiscales canadiennes (TPS / TVH).
          </div>
        </div>
      </div>

      {/* Confirmation of payment notification form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-brand-orange">
              <FaInfoCircle /> Optionnel pour accélérer votre reçu
            </span>
            <h3 className="mt-2 text-xl font-black text-brand-navy">
              Vous venez d&apos;effectuer un virement Interac ?
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Renseignez votre référence pour que notre service comptable rapproche immédiatement votre paiement et vous transmette votre reçu.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onNotifySubmit)} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Votre nom complet *</label>
            <input {...register("customer_name")} className={fieldClass} placeholder="Ex. Sophie Tremblay" />
            {errors.customer_name && <p className="mt-1 text-xs text-red-600">{errors.customer_name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Adresse courriel *</label>
            <input {...register("customer_email")} className={fieldClass} placeholder="sophie@exemple.ca" type="email" />
            {errors.customer_email && <p className="mt-1 text-xs text-red-600">{errors.customer_email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Numéro de téléphone *</label>
            <input {...register("customer_phone")} className={fieldClass} placeholder="514 000 0000" />
            {errors.customer_phone && <p className="mt-1 text-xs text-red-600">{errors.customer_phone.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Numéro de facture ou Référence *</label>
            <input {...register("order_reference")} className={fieldClass} placeholder="Ex. Facture 2JK-1042" />
            {errors.order_reference && <p className="mt-1 text-xs text-red-600">{errors.order_reference.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Montant réglé ($ CAD) *</label>
            <input {...register("amount")} className={fieldClass} placeholder="Ex. 185.00" type="number" step="0.01" />
            {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Remarques ou référence bancaire</label>
            <input {...register("proof_note")} className={fieldClass} placeholder="Ex. Virement Interac réf: CA123456" />
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-black text-white shadow-glow transition hover:bg-orange-600 disabled:opacity-60"
            >
              <FaPaperPlane /> {isSubmitting ? "Envoi en cours..." : "Confirmer mon virement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
