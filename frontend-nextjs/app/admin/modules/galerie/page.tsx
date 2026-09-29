import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminGalleryPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Galerie et albums"
        resource="gallery"
        description="Images, albums et contenus avant/apres."
        fields={[
          { name: "album_id", label: "ID album", type: "number" },
          { name: "title", label: "Titre", required: true },
          { name: "image", label: "Image", required: true, type: "image" },
          { name: "before_image", label: "Image avant", type: "image" },
          { name: "after_image", label: "Image apres", type: "image" },
          { name: "alt_text", label: "Texte alternatif" },
          { name: "display_order", label: "Ordre", type: "number" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Actif", value: "active" }, { label: "Inactif", value: "inactive" }] }
        ]}
      />
    </AdminLayout>
  );
}
