import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminServicesPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Gestion des services"
        resource="services"
        description="Créez, modifiez et organisez les services proposés sur le site (Résidentiel, Commercial, Véhicules, Écologique, Après rénovation...)."
        fields={[
          {
            name: "title",
            label: "Nom du service",
            required: true,
            placeholder: "Ex: Nettoyage automobile & Habitacle mobile"
          },
          {
            name: "slug",
            label: "Identifiant URL (slug)",
            placeholder: "ex: nettoyage-automobile-mobile"
          },
          {
            name: "image",
            label: "Photo d'illustration du service",
            type: "image",
            placeholder: "Téléversez une photo ou collez une URL d'image"
          },
          {
            name: "short_description",
            label: "Accroche rapide (résumé sur les cartes)",
            placeholder: "Ex: Service mobile à domicile ou au travail. Shampoing sièges et lustrage complet."
          },
          {
            name: "description",
            label: "Description détaillée des prestations",
            type: "textarea",
            placeholder: "Détaillez le déroulement, les équipements spécialisés, les produits biodégradables utilisés, la durée moyenne..."
          },
          {
            name: "icon",
            label: "Badge ou Icône indicative",
            placeholder: "Ex: FaCar, FaBroom, FaLeaf, FaBuilding..."
          },
          {
            name: "price",
            label: "Tarif estimatif ou à partir de ($ CAD)",
            type: "number",
            placeholder: "Ex: 140"
          },
          {
            name: "display_order",
            label: "Ordre d'affichage (1 = premier)",
            type: "number",
            placeholder: "1"
          },
          {
            name: "status",
            label: "Statut de publication",
            type: "select",
            options: [
              { label: "Actif (visible sur le site)", value: "active" },
              { label: "Inactif (brouillon masqué)", value: "inactive" }
            ]
          }
        ]}
      />
    </AdminLayout>
  );
}
