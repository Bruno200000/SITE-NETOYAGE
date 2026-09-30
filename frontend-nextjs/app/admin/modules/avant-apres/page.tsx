import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminBeforeAfterPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Transformations Avant / Après"
        resource="gallery"
        description="Gérez les démonstrations de résultats avant / après de 2JK Services. Les clients peuvent glisser le curseur interactif et lire vos explications sur la méthode de nettoyage."
        fields={[
          {
            name: "title",
            label: "Titre de la réalisation",
            required: true,
            placeholder: "Ex: Remise à neuf habitacle automobile & sièges tachés"
          },
          {
            name: "before_image",
            label: "Photo AVANT intervention",
            required: true,
            type: "image",
            badge: "Photo Avant",
            placeholder: "Téléversez la photo avant nettoyage"
          },
          {
            name: "after_image",
            label: "Photo APRÈS intervention",
            required: true,
            type: "image",
            badge: "Photo Après",
            placeholder: "Téléversez la photo après nettoyage"
          },
          {
            name: "alt_text",
            label: "Commentaires de l'équipe & détails des travaux",
            type: "textarea",
            placeholder: "Détaillez le travail accompli : état initial difficile, injection-extraction haute pression, traitement antibactérien écologique, résultat impeccable sans odeur."
          },
          {
            name: "is_before_after",
            label: "Mode d'affichage",
            type: "select",
            options: [
              { label: "Curseur comparatif interactif (Avant / Après)", value: "1" },
              { label: "Photo simple dans la galerie", value: "0" }
            ]
          },
          {
            name: "display_order",
            label: "Ordre d'affichage (1 = en tête)",
            type: "number",
            placeholder: "1"
          },
          {
            name: "status",
            label: "Statut de publication",
            type: "select",
            options: [
              { label: "Publié (visible sur le site)", value: "active" },
              { label: "Brouillon (masqué)", value: "inactive" }
            ]
          }
        ]}
      />
    </AdminLayout>
  );
}
