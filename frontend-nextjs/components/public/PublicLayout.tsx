import { Footer } from "./Footer";
import { Header } from "./Header";
import { PublicRoutePrefetch } from "./PublicRoutePrefetch";
import { ScrollReveal } from "./ScrollReveal";
import { WhatsAppButton } from "./WhatsAppButton";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <PublicRoutePrefetch />
      <ScrollReveal />
      <main>{children}</main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
