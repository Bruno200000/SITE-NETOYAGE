import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminGalleryCategoriesPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Categories galerie"
        resource="gallery-categories"
        description="Categories utilisees pour classer les albums et images."
        fields={[
          { name: "name", label: "Nom", required: true },
          { name: "slug", label: "Lien de la categorie" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Actif", value: "active" }, { label: "Inactif", value: "inactive" }] }
        ]}
      />
    </AdminLayout>
  );
}
