import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminTestimonialsPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Temoignages"
        resource="testimonials"
        description="Avis clients, notes et statuts de publication."
        fields={[
          { name: "client_name", label: "Nom client", required: true },
          { name: "profession", label: "Profession" },
          { name: "photo", label: "Photo du client", type: "image" },
          { name: "rating", label: "Note", type: "number" },
          { name: "comment", label: "Commentaire", required: true, type: "textarea" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Publie", value: "published" }, { label: "En attente", value: "pending" }, { label: "Inactif", value: "inactive" }] }
        ]}
      />
    </AdminLayout>
  );
}
