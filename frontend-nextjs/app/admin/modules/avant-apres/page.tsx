import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminBeforeAfterPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Transformations Avant / Après"
        resource="gallery"
        description="Ajoutez ou actualisez vos réalisations avant/après. Vous pouvez téléverser les photos et rédiger vos commentaires d'intervention visibles par les clients."
        fields={[
          { name: "title", label: "Titre de la réalisation", required: true, placeholder: "Ex: Rénovation cuisine commerciale ou Habitacle auto" },
          { name: "before_image", label: "Photo AVANT (téléversement ou URL)", required: true, type: "image" },
          { name: "after_image", label: "Photo APRÈS (téléversement ou URL)", required: true, type: "image" },
          { name: "alt_text", label: "Commentaires de l'équipe / Détails des travaux", type: "textarea", placeholder: "Décrivez le travail réalisé, les défis relevés, les produits écologiques utilisés et le résultat final." },
          { name: "is_before_after", label: "Affichage comparatif", type: "select", options: [{ label: "Curseur interactif Avant / Après", value: "1" }, { label: "Image simple", value: "0" }] },
          { name: "display_order", label: "Ordre d'affichage (1 = premier)", type: "number" },
          { name: "status", label: "Publication", type: "select", options: [{ label: "Publié (en ligne)", value: "active" }, { label: "Brouillon (masqué)", value: "inactive" }] }
        ]}
      />
    </AdminLayout>
  );
}
