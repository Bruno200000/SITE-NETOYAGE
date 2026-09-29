import { PageHero } from "@/components/public/PageHero";
import { PaymentProofForm } from "@/components/public/PaymentProofForm";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageMetadata } from "@/lib/seo";
import { siteImages } from "@/data/site";

export const metadata = pageMetadata("Centre de Paiement & Facturation", "Modalités de règlement de vos prestations de nettoyage : Virement Interac, Carte bancaire et Comptes commerciaux.", "/paiement/");

export default function PaymentPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Paiement & Facturation"
        title="Règlement simple, rapide et 100% sécurisé."
        text="Retrouvez ici toutes les informations pour régler vos factures : Virement Interac au Canada, carte bancaire ou entente commerciale d'entreprise."
        image={siteImages.commercial}
      />
      <Section eyebrow="Modes de règlement" title="Consultez nos modalités de paiement et notifiez votre virement.">
        <PaymentProofForm />
      </Section>
    </PublicLayout>
  );
}
