import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminMessagesPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Messages contact"
        resource="contacts"
        description="Messages recus depuis le formulaire contact."
        fields={[
          { name: "name", label: "Nom", required: true },
          { name: "email", label: "Email", required: true, type: "email" },
          { name: "phone", label: "Telephone", type: "tel" },
          { name: "subject", label: "Sujet" },
          { name: "message", label: "Message", required: true, type: "textarea" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Nouveau", value: "new" }, { label: "Traite", value: "processed" }, { label: "Archive", value: "archived" }] }
        ]}
      />
    </AdminLayout>
  );
}
