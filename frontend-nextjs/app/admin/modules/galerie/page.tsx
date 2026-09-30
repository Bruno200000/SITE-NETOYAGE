"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaImages, FaInfoCircle, FaFolderOpen, FaLayerGroup } from "react-icons/fa";

export default function AdminGalleryPage() {
  return (
    <AdminLayout>
      {/* Info banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50/60 via-purple-50/30 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600">
            <FaImages className="text-lg" />
          </span>
          <div>
            <h3 className="text-lg font-black text-slate-900">Galerie d&apos;images</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500 max-w-2xl">
              Gérez toutes les photos de vos réalisations. Les images actives apparaissent sur la page publique
              <strong> /galerie</strong>. Associez chaque image à un album pour une meilleure organisation.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaFolderOpen className="mt-0.5 shrink-0 text-brand-orange" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Albums</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Créez d&apos;abord vos albums dans <strong>Gestion des albums</strong>, puis notez leurs IDs pour les associer ici.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaLayerGroup className="mt-0.5 shrink-0 text-purple-500" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Avant / Après</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Pour des comparaisons interactives, utilisez le module <strong>Avant / Après</strong> dédié.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <FaInfoCircle className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-[11px] text-blue-900/80">
              <strong>Formats conseillés :</strong> JPG ou WebP, minimum 1200px de large, poids max 2Mo pour un chargement optimal.
            </p>
          </div>
        </div>
      </div>

      <CrudTable
        title="Galerie d'images"
        resource="gallery"
        description="Photos de réalisations affichées sur la page publique /galerie. Organisez par albums et contrôlez la visibilité."
        fields={[
          { name: "album_id", label: "ID de l'album (optionnel)", type: "number", placeholder: "Laissez vide si sans album" },
          { name: "title", label: "Titre de la photo / réalisation", required: true, placeholder: "Ex: Nettoyage complet cuisine restaurant — Moncton" },
          { name: "image", label: "Photo principale de la réalisation", required: true, type: "image" },
          { name: "before_image", label: "Photo AVANT intervention (optionnel)", type: "image" },
          { name: "after_image", label: "Photo APRÈS intervention (optionnel)", type: "image" },
          { name: "alt_text", label: "Description / texte alternatif (SEO)", placeholder: "Décrivez ce que montre la photo pour le référencement" },
          { name: "display_order", label: "Ordre d'affichage (1 = premier)", type: "number", placeholder: "1" },
          {
            name: "status",
            label: "Statut de publication",
            type: "select",
            options: [
              { label: "✅ Publié (visible sur le site)", value: "active" },
              { label: "🚫 Masqué (brouillon)", value: "inactive" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
