"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaBriefcase, FaCalendarCheck, FaCheckCircle, FaClock, FaEnvelope, FaImages, FaNewspaper, FaQuoteLeft, FaSoap, FaUsers } from "react-icons/fa";
import type { IconType } from "react-icons";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCharts } from "@/components/admin/StatsCharts";
import { getList } from "@/services/api";

type Row = Record<string, string | number | null | undefined>;
type Metric = [string, string, string, IconType, string, string];

function countStatus(rows: Row[], status: string) {
  return rows.filter((row) => String(row.status || "").toLowerCase() === status).length;
}

function todayLabel() {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date());
}

export default function DashboardPage() {
  const [data, setData] = useState<Record<string, Row[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const resources = ["services", "posts", "gallery", "testimonials", "quotes", "appointments", "contacts", "applications", "job-offers", "notifications", "settings"];
      const entries = await Promise.all(resources.map(async (resource) => {
        try {
          return [resource, await getList<Row>(resource)] as const;
        } catch {
          return [resource, []] as const;
        }
      }));
      setData(Object.fromEntries(entries));
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const metrics: Metric[] = useMemo(() => [
    ["Offres d'emploi", String(data["job-offers"]?.length || 0), `${countStatus(data["job-offers"] || [], "active")} publiees`, FaBriefcase, "bg-amber-50 text-amber-700", "/admin/modules/recrutement"],
    ["Candidatures", String(data.applications?.length || 0), `${(data.applications || []).filter((row) => String(row.status || "").toLowerCase() === "nouveau").length} nouvelles`, FaUsers, "bg-orange-50 text-orange-700", "/admin/modules/recrutement"],
    ["Demandes de devis", String(data.quotes?.length || 0), `${countStatus(data.quotes || [], "pending")} en attente`, FaUsers, "bg-orange-50 text-orange-700", "/admin/modules/devis"],
    ["Rendez-vous", String(data.appointments?.length || 0), `${countStatus(data.appointments || [], "confirmed")} confirmes`, FaCalendarCheck, "bg-blue-50 text-blue-700", "/admin/modules/rendez-vous"],
    ["Messages", String(data.contacts?.length || 0), `${countStatus(data.contacts || [], "new")} nouveaux`, FaEnvelope, "bg-emerald-50 text-emerald-700", "/admin/modules/messages"],
    ["Temoignages", String(data.testimonials?.length || 0), `${countStatus(data.testimonials || [], "pending")} en attente`, FaQuoteLeft, "bg-pink-50 text-pink-700", "/admin/modules/temoignages"],
    ["Services", String(data.services?.length || 0), `${countStatus(data.services || [], "active")} actifs`, FaSoap, "bg-indigo-50 text-indigo-700", "/admin/modules/services"],
    ["Articles", String(data.posts?.length || 0), `${countStatus(data.posts || [], "draft")} brouillons`, FaNewspaper, "bg-cyan-50 text-cyan-700", "/admin/modules/blog"],
    ["Images galerie", String(data.gallery?.length || 0), "elements galerie", FaImages, "bg-violet-50 text-violet-700", "/admin/modules/galerie"],
    ["Avant / Apres", String((data.gallery || []).filter((row) => Number(row.is_before_after) === 1).length), "comparaisons", FaImages, "bg-purple-50 text-purple-700", "/admin/modules/avant-apres"],
    ["Notifications", String(data.notifications?.length || 0), `${(data.notifications || []).filter((item) => Number(item.is_read) === 0).length} non lues`, FaCheckCircle, "bg-green-50 text-green-700", "/admin/notifications"]
  ], [data]);

  const pipeline = [
    ["Nouveau", (data.quotes || []).filter((row) => row.status === "pending").length + (data.contacts || []).filter((row) => row.status === "new").length, "bg-orange-500"],
    ["En cours", (data.quotes || []).filter((row) => row.status === "processed").length + (data.contacts || []).filter((row) => row.status === "processed").length, "bg-blue-500"],
    ["Confirme", (data.appointments || []).filter((row) => row.status === "confirmed").length, "bg-emerald-600"],
    ["Termine", (data.appointments || []).filter((row) => row.status === "completed").length, "bg-slate-700"]
  ] as const;

  const appointments = (data.appointments || []).slice(0, 5);
  const quickActions = [
    ["Publier une offre d'emploi", "/admin/modules/recrutement"],
    ["Traiter les devis", "/admin/modules/devis"],
    ["Confirmer les rendez-vous", "/admin/modules/rendez-vous"],
    ["Ajouter un avant / apres", "/admin/modules/avant-apres"],
    ["Publier les avis", "/admin/modules/temoignages"]
  ];

  return (
    <AdminLayout>
      <div className="mb-8 overflow-hidden rounded-2xl bg-[#071f49] p-6 text-white shadow-2xl shadow-blue-950/15 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange">Back-office 2JK</span>
            <h1 className="mt-2 text-3xl font-black text-white">Tableau de bord</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/78">Donnees reelles chargees depuis la base MySQL et l'API du site.</p>
          </div>
          <div className="rounded-md border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold capitalize text-white backdrop-blur">
            {loading ? "Chargement..." : todayLabel()}
          </div>
        </div>
      </div>

      <div className="mb-8 hidden flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Tableau de bord</h1>
          <p className="mt-2 text-slate-600">Donnees reelles chargees depuis la base MySQL et l'API du site.</p>
        </div>
        <div className="rounded-md border border-blue-100 bg-white px-4 py-3 text-sm font-semibold capitalize text-slate-600 shadow-sm">
          {loading ? "Chargement..." : todayLabel()}
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, sub, Icon, color, href]) => (
          <Link key={label} href={href} className="admin-panel block p-5 transition hover:-translate-y-1 hover:shadow-premium">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-slate-500">{label}</span>
                <strong className="mt-3 block text-3xl font-black text-slate-950">{value}</strong>
                <p className="mt-1 text-sm text-slate-500">{sub}</p>
              </div>
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${color}`}><Icon /></span>
            </div>
          </Link>
        ))}
      </div>

      <section className="admin-panel mb-8 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-950">Board des demandes</h2>
            <p className="text-sm text-slate-500">Flux construit depuis devis, messages et rendez-vous.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {pipeline.map(([label, count, color]) => (
            <div key={label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-800">{label}</h3>
                <span className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-black text-white ${color}`}>{count}</span>
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                {count ? `${count} element(s) dans cette etape.` : "Aucun element pour le moment."}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <article className="admin-panel p-5">
          <FaClock className="text-2xl text-brand-orange" />
          <h3 className="mt-4 text-xl font-black text-slate-950">Actions rapides</h3>
          <div className="mt-4 grid gap-3">
            {quickActions.map(([item, href]) => (
              <Link key={item} href={href} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:border-brand-orange hover:bg-brand-orange hover:text-white">{item}</Link>
            ))}
          </div>
        </article>
        <article className="admin-panel p-5 lg:col-span-2">
          <h3 className="text-xl font-black text-slate-950">Rendez-vous recents</h3>
          <div className="mt-4 grid gap-3">
            {appointments.map((item) => (
              <Link key={String(item.id)} href="/admin/modules/rendez-vous" className="flex items-center justify-between rounded-lg border border-blue-100 px-4 py-3 transition hover:bg-blue-50">
                <span className="font-semibold text-slate-700">{item.appointment_date || "Date a confirmer"} - {item.name || item.email}</span>
                <span className="rounded-full bg-brand-mint px-3 py-1 text-xs font-black text-brand-green">{item.status || "pending"}</span>
              </Link>
            ))}
            {!appointments.length ? <p className="rounded-lg bg-blue-50 px-4 py-5 text-sm text-slate-500">Aucun rendez-vous en base pour le moment.</p> : null}
          </div>
        </article>
      </div>

      <StatsCharts />
    </AdminLayout>
  );
}
