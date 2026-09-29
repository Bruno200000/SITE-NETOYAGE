import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminServicesPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Gestion des services"
        resource="services"
        description="Services affiches sur le site public."
        fields={[
          { name: "title", label: "Titre", required: true },
          { name: "slug", label: "Lien du service" },
          { name: "short_description", label: "Description courte" },
          { name: "description", label: "Description complete", type: "textarea" },
          { name: "icon", label: "Icone" },
          { name: "price", label: "Prix", type: "number" },
          { name: "display_order", label: "Ordre", type: "number" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Actif", value: "active" }, { label: "Inactif", value: "inactive" }] }
        ]}
      />
    </AdminLayout>
  );
}
