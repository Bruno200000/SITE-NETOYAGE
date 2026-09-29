"use client";

import { useState } from "react";
import { FaFacebook, FaPaperPlane, FaCopy, FaCheck, FaInfoCircle, FaExternalLinkAlt, FaMagic } from "react-icons/fa";
import Swal from "sweetalert2";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function AdminBlogPage() {
  const company = useSiteSettings();
  const [copied, setCopied] = useState(false);
  const [sampleTip, setSampleTip] = useState(
    "✨ Astuce Propreté 2JK Services Inc. ✨\n\nPour préserver la brillance de vos comptoirs et surfaces sans laisser de traces chimiques, privilégiez toujours un chiffon microfibre humide associé à un savon doux au pH neutre.\n\nBesoin d'un grand ménage ou d'un entretien régulier ? Contactez nos équipes mobiles au 514 623 5610 !"
  );

  function handleShareFacebook() {
    const shareUrl = encodeURIComponent("https://2jkservices.com/blog");
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(sampleTip)}`;
    window.open(fbShareUrl, "_blank", "width=600,height=500");
  }

  function handleCopyText() {
    navigator.clipboard.writeText(sampleTip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    Swal.fire({
      icon: "success",
      title: "Texte copié !",
      text: "Le conseil est prêt à être collé directement sur votre page Facebook avec l'image.",
      timer: 2200,
      showConfirmButton: false
    });
  }

  return (
    <AdminLayout>
      {/* Facebook Synchronization Card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1877f2]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1877f2]">
              <FaFacebook /> Publication automatique Facebook
            </span>
            <h3 className="mt-2 text-xl font-black text-brand-navy">
              Synchronisation des conseils &amp; astuces sur Facebook
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Lorsque vous créez ou mettez à jour un article de blog, vous pouvez le diffuser directement sur votre page Facebook avec son image et son résumé.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
              <span>{copied ? "Texte copié !" : "Copier le texte prêt"}</span>
            </button>
            <button
              type="button"
              onClick={handleShareFacebook}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1877f2] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#166fe5]"
            >
              <FaFacebook />
              <span>Publier sur Facebook</span>
              <FaExternalLinkAlt className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* Quick Tips Generator preview */}
        <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4">
          <label className="block text-[11px] font-black uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <FaMagic className="text-brand-orange" /> Modèle de post Facebook (Conseils &amp; Astuces)
          </label>
          <textarea
            value={sampleTip}
            onChange={(e) => setSampleTip(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 outline-none focus:border-brand-orange"
          />
          <p className="mt-1.5 text-[11px] text-slate-400">
            Astuce : vous pouvez aussi configurer votre <strong>Page Access Token Meta</strong> dans les paramètres pour automatiser l&apos;envoi instantané dès publication d&apos;un article.
          </p>
        </div>
      </div>

      <CrudTable
        title="Gestion du blog &amp; Conseils"
        resource="posts"
        description="Rédigez, modifiez et publiez vos articles, conseils d'entretien et astuces propreté."
        fields={[
          { name: "title", label: "Titre de l'article", required: true, placeholder: "Ex: 5 astuces pour garder un intérieur impeccable" },
          { name: "slug", label: "Lien URL (slug)", placeholder: "ex: 5-astuces-proprete" },
          { name: "excerpt", label: "Résumé court (partagé sur Facebook)", placeholder: "Accroche concise et conseils clés pour le post" },
          { name: "image", label: "Image principale (affichée sur Facebook)", type: "image" },
          { name: "content", label: "Contenu complet de l'article", type: "textarea", placeholder: "Rédigez ici vos conseils, astuces et méthodes détaillées..." },
          { name: "tags", label: "Mots-clés & Hashtags", placeholder: "Ex: #Nettoyage #Conseils #EntretienAuto #2JKServices" },
          { name: "meta_title", label: "Titre SEO" },
          { name: "meta_description", label: "Description SEO", type: "textarea" },
          { name: "og_image", label: "Image Open Graph Facebook", type: "image" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Publié (en ligne)", value: "published" }, { label: "Brouillon", value: "draft" }, { label: "Planifié", value: "scheduled" }] }
        ]}
      />
    </AdminLayout>
  );
}
