"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaReply,
  FaWhatsapp,
} from "react-icons/fa";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function AdminMessagesPage() {
  const company = useSiteSettings();
  const whatsapp = company.whatsapp?.replace(/\D/g, "") || "15146235610";

  const quickReplies = [
    {
      label: "Accusé de réception",
      text: "Bonjour, nous avons bien reçu votre message et reviendrons vers vous dans les 24h. Merci de votre confiance — Équipe 2JK Services.",
    },
    {
      label: "Demande de devis",
      text: "Bonjour, pour recevoir une estimation personnalisée, merci de remplir notre formulaire de devis en ligne sur notre site ou de nous appeler directement au 514 623 5610.",
    },
    {
      label: "Prise en charge confirmée",
      text: "Bonjour, nous confirmons la bonne prise en charge de votre demande. Un agent vous contactera sous peu pour définir les détails. Merci !",
    },
  ];

  const [copied, setCopied] = useState<number | null>(null);

  function handleCopy(index: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2200);
  }

  return (
    <AdminLayout>
      {/* Quick-reply templates */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700">
              <FaReply className="text-[10px]" /> Réponses rapides
            </span>
            <h3 className="mt-2 text-lg font-black text-slate-900">
              Modèles de réponse prêts à l&apos;emploi
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-5">
              Copiez un modèle et collez-le dans votre messagerie email ou WhatsApp pour répondre rapidement.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:?subject=2JK%20Services%20-%20R%C3%A9ponse`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FaEnvelope /> Ouvrir la messagerie
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25d366] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1db954]"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href={`tel:${company.phone || "5146235610"}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-700"
            >
              <FaPhoneAlt /> Appeler
            </a>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {quickReplies.map((reply, index) => (
            <div key={reply.label} className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-blue-600">
                {reply.label}
              </p>
              <p className="text-xs leading-5 text-slate-600 line-clamp-3">{reply.text}</p>
              <button
                type="button"
                onClick={() => handleCopy(index, reply.text)}
                className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  copied === index
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {copied === index ? "✓ Copié !" : "Copier le texte"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <CrudTable
        title="Messages contact"
        resource="contacts"
        description="Messages et questions reçus depuis le formulaire de contact public. Traitez chaque message en modifiant son statut."
        fields={[
          { name: "name", label: "Nom complet", required: true, placeholder: "Prénom et nom du client" },
          { name: "email", label: "Adresse e-mail", required: true, type: "email", placeholder: "client@email.com" },
          { name: "phone", label: "Téléphone", type: "tel", placeholder: "Ex: 514 623 5610" },
          { name: "subject", label: "Objet du message", placeholder: "Ex: Demande de renseignements sur le nettoyage commercial" },
          { name: "message", label: "Contenu du message", required: true, type: "textarea", placeholder: "Le texte du message reçu..." },
          {
            name: "status",
            label: "Statut de traitement",
            type: "select",
            options: [
              { label: "🆕 Nouveau (non lu)", value: "new" },
              { label: "🔄 En cours de traitement", value: "processed" },
              { label: "📁 Archivé", value: "archived" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
