import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminTransactionsPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Transactions bancaires"
        resource="payments"
        description="Preuves de paiement envoyees depuis le site et confirmations administratives."
        fields={[
          { name: "reference", label: "Reference" },
          { name: "order_reference", label: "Commande / devis" },
          { name: "customer_name", label: "Nom client", required: true },
          { name: "customer_email", label: "Email", required: true, type: "email" },
          { name: "customer_phone", label: "Telephone", type: "tel" },
          { name: "amount", label: "Montant", required: true, type: "number" },
          { name: "currency", label: "Devise" },
          { name: "proof_image", label: "Preuve", type: "image" },
          { name: "proof_note", label: "Note", type: "textarea" },
          { name: "status", label: "Statut", type: "select", options: [{ label: "En attente", value: "pending" }, { label: "Preuve recue", value: "awaiting_payment" }, { label: "Paye", value: "paid" }, { label: "Echoue", value: "failed" }, { label: "Annule", value: "cancelled" }] }
        ]}
      />
    </AdminLayout>
  );
}
