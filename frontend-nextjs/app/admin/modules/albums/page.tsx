import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminAlbumsPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Albums galerie"
        resource="albums"
        description="Albums utilises pour organiser les images de la galerie."
        fields={[
          { name: "category_id", label: "ID categorie", type: "number" },
          { name: "title", label: "Titre", required: true },
          { name: "slug", label: "Lien de l'album" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "cover_image", label: "Image de couverture", type: "image" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Actif", value: "active" }, { label: "Inactif", value: "inactive" }] }
        ]}
      />
    </AdminLayout>
  );
}
