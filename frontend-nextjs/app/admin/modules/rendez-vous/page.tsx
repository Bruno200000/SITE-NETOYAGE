import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminAppointmentsPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Rendez-vous"
        resource="appointments"
        description="Demandes de rendez-vous a confirmer."
        fields={[
          { name: "name", label: "Nom", required: true },
          { name: "email", label: "Email", required: true, type: "email" },
          { name: "phone", label: "Telephone", required: true, type: "tel" },
          { name: "address", label: "Adresse" },
          { name: "appointment_date", label: "Date", type: "date" },
          { name: "appointment_time", label: "Heure", type: "time" },
          { name: "message", label: "Message", type: "textarea" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "En attente", value: "pending" }, { label: "Confirme", value: "confirmed" }, { label: "Termine", value: "completed" }, { label: "Annule", value: "cancelled" }] }
        ]}
      />
    </AdminLayout>
  );
}
