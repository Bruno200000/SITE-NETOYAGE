"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaImages, FaInfoCircle, FaMagic, FaMousePointer } from "react-icons/fa";

export default function AdminAlbumsPage() {
  return (
    <AdminLayout>
      {/* Info banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/60 via-fuchsia-50/30 to-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-600">
            <FaImages className="text-lg" />
          </span>
          <div>
            <h3 className="text-lg font-black text-slate-900">Albums galerie</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500 max-w-2xl">
              Les albums servent à grouper vos images par catégorie ou chantier (ex: «Résidentiel Moncton 2024»,
              «Commercial — Restaurant Dieppe»). Créez d&apos;abord les albums ici, puis associez vos images via le module Galerie.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaMagic className="mt-0.5 shrink-0 text-brand-orange" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Slug auto-généré</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Le lien de l&apos;album est automatiquement généré à partir du titre. Vous pouvez le personnaliser.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaMousePointer className="mt-0.5 shrink-0 text-purple-500" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">Image de couverture</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Ajoutez une image de couverture accrocheuse pour chaque album sur la page galerie.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <FaInfoCircle className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-[11px] text-blue-900/80">
              <strong>Workflow :</strong> Créez l&apos;album → notez son ID → ouvrez le module Galerie → associez vos images à cet album via «ID de l&apos;album».
            </p>
          </div>
        </div>
      </div>

      <CrudTable
        title="Albums galerie"
        resource="albums"
        description="Albums utilisés pour organiser et regrouper les photos de vos réalisations par thème ou chantier."
        fields={[
          { name: "category_id", label: "ID de catégorie galerie (optionnel)", type: "number", placeholder: "Laissez vide si sans catégorie" },
          { name: "title", label: "Nom de l'album", required: true, placeholder: "Ex: Nettoyage résidentiel — Moncton 2024" },
          { name: "slug", label: "Identifiant URL de l'album (auto-généré)", placeholder: "ex: nettoyage-residentiel-moncton-2024" },
          { name: "description", label: "Description de l'album", type: "textarea", placeholder: "Décrivez le type de chantiers regroupés dans cet album, la région, la période..." },
          { name: "cover_image", label: "Image de couverture de l'album", type: "image" },
          {
            name: "status",
            label: "Statut de visibilité",
            type: "select",
            options: [
              { label: "✅ Actif (album visible)", value: "active" },
              { label: "🚫 Inactif (album masqué)", value: "inactive" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
