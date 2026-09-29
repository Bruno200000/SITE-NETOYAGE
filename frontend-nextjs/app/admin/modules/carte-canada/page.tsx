import { AdminLayout } from "@/components/admin/AdminLayout";
import { CanadaMapSettingsManager } from "@/components/admin/CanadaMapSettingsManager";

export const metadata = {
  title: "Carte Canada & Couverture - 2JK Admin",
  description: "Personnalisez la carte du Canada et les zones d'intervention."
};

export default function AdminCanadaMapPage() {
  return (
    <AdminLayout>
      <CanadaMapSettingsManager />
    </AdminLayout>
  );
}
