import dynamic from "next/dynamic";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { pageHeroes } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

const AppointmentBookingClient = dynamic(
  () => import("@/components/public/AppointmentBookingClient").then((mod) => mod.AppointmentBookingClient),
  { ssr: false, loading: () => <div className="py-16 text-center text-slate-500 text-sm animate-pulse">Chargement du formulaire de réservation…</div> }
);

export const metadata = pageMetadata("Prise de rendez-vous", "Planifiez une intervention ou une visite technique en temps réel.", "/rendez-vous/");

export default function AppointmentPage() {
  return (
    <PublicLayout>
      <PageHero {...pageHeroes.appointment} ctaHref="#reservation-autonome" ctaLabel="Voir les créneaux" />
      <Section id="reservation-autonome" eyebrow="Rendez-vous" title="Planifiez votre intervention en quelques secondes.">
        <AppointmentBookingClient />
      </Section>
    </PublicLayout>
  );
}
