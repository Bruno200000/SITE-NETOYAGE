import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminFaqPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="FAQ"
        resource="faq"
        description="Questions frequentes affichees sur la page publique FAQ."
        fields={[
          { name: "question", label: "Question", required: true },
          { name: "answer", label: "Reponse", required: true, type: "textarea" },
          { name: "display_order", label: "Ordre", type: "number" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "Actif", value: "active" }, { label: "Inactif", value: "inactive" }] }
        ]}
      />
    </AdminLayout>
  );
}
