import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminQuotesPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Demandes de devis"
        resource="quotes"
        description="Demandes envoyees depuis la page devis."
        fields={[
          { name: "name", label: "Nom" },
          { name: "email", label: "Email", required: true, type: "email" },
          { name: "phone", label: "Telephone", required: true, type: "tel" },
          { name: "address", label: "Adresse" },
          { name: "city", label: "Ville" },
          { name: "service_type", label: "Service" },
          { name: "budget", label: "Budget" },
          { name: "desired_date", label: "Date souhaitee", type: "date" },
          { name: "message", label: "Message", type: "textarea" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "En attente", value: "pending" }, { label: "Traite", value: "processed" }, { label: "Annule", value: "cancelled" }] }
        ]}
      />
    </AdminLayout>
  );
}
