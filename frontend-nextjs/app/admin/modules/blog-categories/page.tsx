import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";

export default function AdminBlogCategoriesPage() {
  return (
    <AdminLayout>
      <CrudTable
        title="Categories du blog"
        resource="blog-categories"
        description="Organisation des articles publies sur le blog."
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
