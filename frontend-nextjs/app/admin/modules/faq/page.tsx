"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaQuestionCircle, FaInfoCircle, FaLightbulb } from "react-icons/fa";

const faqExamples = [
  { q: "Intervenez-vous le week-end ?", a: "Oui, nous proposons des créneaux le samedi et le dimanche sur demande." },
  { q: "Fournissez-vous les produits de nettoyage ?", a: "Absolument. Notre équipe arrive avec tout le matériel et les produits professionnels certifiés." },
  { q: "Puis-je obtenir un devis gratuit ?", a: "Oui, demandez votre devis en ligne en quelques clics sur la page /devis." },
];

export default function AdminFaqPage() {
  return (
    <AdminLayout>
      {/* Info banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/60 via-violet-50/30 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-600">
            <FaQuestionCircle className="text-lg" />
          </span>
          <div>
            <h3 className="text-lg font-black text-slate-900">Foire aux questions (FAQ)</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500 max-w-2xl">
              Les questions actives s&apos;affichent sur la page publique <strong>/faq</strong> pour aider vos visiteurs à trouver rapidement des réponses sans vous contacter.
              Plus votre FAQ est complète, moins vous recevrez de questions répétitives par email ou téléphone.
            </p>
          </div>
        </div>

        {/* FAQ examples */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <FaLightbulb className="text-amber-500" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              Exemples de questions populaires chez 2JK Services
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {faqExamples.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <p className="text-[11px] font-bold text-slate-900">❓ {q}</p>
                <p className="mt-1 text-[11px] text-slate-500 leading-4">✅ {a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900/80">
          <FaInfoCircle className="mt-0.5 shrink-0 text-blue-500" />
          <span>
            <strong>Conseil SEO :</strong> Des questions bien rédigées améliorent votre référencement Google grâce aux
            rich snippets FAQ qui s&apos;affichent directement dans les résultats de recherche.
          </span>
        </div>
      </div>

      <CrudTable
        title="FAQ — Questions fréquentes"
        resource="faq"
        description="Questions affichées sur la page publique /faq. Seules les questions actives sont visibles."
        fields={[
          {
            name: "question",
            label: "Question posée par les clients",
            required: true,
            placeholder: "Ex: Intervenez-vous le week-end ?",
          },
          {
            name: "answer",
            label: "Réponse claire et complète",
            required: true,
            type: "textarea",
            placeholder: "Ex: Oui, nous proposons des créneaux le samedi sur demande. Contactez-nous pour vérifier la disponibilité.",
          },
          {
            name: "category",
            label: "Catégorie (optionnel)",
            placeholder: "Ex: Tarifs, Disponibilité, Méthodes, Produits...",
          },
          { name: "display_order", label: "Ordre d'affichage (1 = premier)", type: "number", placeholder: "1" },
          {
            name: "status",
            label: "Statut de publication",
            type: "select",
            options: [
              { label: "✅ Actif (visible sur le site)", value: "active" },
              { label: "🚫 Inactif (masqué)", value: "inactive" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
