"use client";

import { useState } from "react";
import { FaBriefcase, FaUsers } from "react-icons/fa";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

const offerFields = [
  { name: "title", label: "Titre du poste", required: true },
  { name: "slug", label: "Lien (slug)", placeholder: "ex. agent-entretien-residentiel" },
  { name: "location", label: "Lieu / Ville", placeholder: "Ex. Moncton, Dieppe, Fredericton" },
  {
    name: "contract_type",
    label: "Type de contrat",
    type: "select" as const,
    options: [
      { label: "Temps plein", value: "Temps plein" },
      { label: "Temps partiel", value: "Temps partiel" },
      { label: "Temps plein / partiel", value: "Temps plein / partiel" },
      { label: "Soir / nuit / week-end", value: "Soir / nuit / week-end" },
      { label: "Flexible", value: "Flexible" },
    ],
  },
  { name: "salary", label: "Salaire", placeholder: "Ex. A discuter, 20$/h + primes" },
  { name: "short_description", label: "Accroche (carte publique)" },
  { name: "description", label: "Description complete", type: "textarea" as const },
  { name: "requirements", label: "Profil recherche", type: "textarea" as const },
  { name: "display_order", label: "Ordre d'affichage", type: "number" as const },
  {
    name: "status",
    label: "Statut",
    type: "select" as const,
    options: [
      { label: "Publiee (visible sur le site)", value: "active" },
      { label: "Brouillon / Masquee", value: "inactive" },
    ],
  },
];

const applicationFields = [
  { name: "fullname", label: "Nom complet", required: true },
  { name: "email", label: "Courriel", required: true, type: "email" as const },
  { name: "phone", label: "Téléphone", required: true, type: "tel" as const },
  { name: "poste", label: "Poste visé", required: true },
  { name: "ville", label: "Ville / Adresse au Canada" },
  { name: "dispo", label: "Disponibilités" },
  { name: "cv_file", label: "Fichier CV", type: "text" as const },
  { name: "message", label: "Présentation / Motivations", type: "textarea" as const },
  {
    name: "status",
    label: "Statut",
    type: "select" as const,
    options: [
      { label: "Nouveau", value: "nouveau" },
      { label: "Contacté", value: "contacte" },
      { label: "Entretien", value: "entretien" },
      { label: "Embauché / Accepté", value: "accepte" },
      { label: "Refusé", value: "refuse" },
    ],
  },
];

export default function AdminRecrutementPage() {
  const [tab, setTab] = useState<"offres" | "candidatures">("offres");

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setTab("offres")}
          className={`admin-btn ${tab === "offres" ? "admin-btn-primary" : "admin-btn-ghost"}`}
        >
          <FaBriefcase /> Offres d&apos;emploi
        </button>
        <button
          type="button"
          onClick={() => setTab("candidatures")}
          className={`admin-btn ${tab === "candidatures" ? "admin-btn-primary" : "admin-btn-ghost"}`}
        >
          <FaUsers /> Candidatures recues
        </button>
      </div>

      {tab === "offres" ? (
        <CrudTable
          title="Offres d'emploi"
          resource="job-offers"
          description="Publiez ici les postes visibles sur la page publique /recrutement. Statut active = visible, inactive = masquee."
          fields={offerFields}
        />
      ) : (
        <CrudTable
          title="Candidatures recrutement"
          resource="applications"
          description="Candidatures envoyees depuis la page /recrutement (formulaire Postuler)."
          fields={applicationFields}
        />
      )}
    </AdminLayout>
  );
}

