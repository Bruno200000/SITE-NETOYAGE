import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollReveal } from "./ScrollReveal";
import { WhatsAppButton } from "./WhatsAppButton";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ScrollReveal />
      <main>{children}</main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
