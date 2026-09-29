import { PublicLayout } from "@/components/public/PublicLayout";
import { ContactContent } from "@/components/public/ContactContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contact", "Contactez 2JK Services Inc. pour vos besoins de nettoyage.", "/contact/");

export default function ContactPage() {
  return (
    <PublicLayout>
      <ContactContent />
    </PublicLayout>
  );
}

