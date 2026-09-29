import Link from "next/link";
import { FaCalendarCheck, FaEnvelope, FaFileSignature } from "react-icons/fa";
import { AdminLayout } from "@/components/admin/AdminLayout";

const cards = [
  ["Devis", "Demandes de prix envoyees depuis le site.", "/admin/modules/devis", FaFileSignature],
  ["Rendez-vous", "Creneaux et visites techniques a confirmer.", "/admin/modules/rendez-vous", FaCalendarCheck],
  ["Messages", "Contacts et questions envoyes par les visiteurs.", "/admin/modules/messages", FaEnvelope]
] as const;

export default function AdminRequestsPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-950">Demandes</h1>
        <p className="mt-2 text-slate-600">Chaque onglet a maintenant sa propre page de gestion.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(([title, text, href, Icon]) => (
          <Link key={href} href={href} className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#0b3a8f] transition group-hover:bg-[#0b3a8f] group-hover:text-white">
              <Icon />
            </span>
            <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{text}</p>
            <span className="mt-5 inline-flex text-sm font-black uppercase tracking-wide text-brand-orange">Ouvrir</span>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
