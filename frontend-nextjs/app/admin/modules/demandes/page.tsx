"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCalendarCheck,
  FaCheckCircle,
  FaEnvelope,
  FaFileSignature,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getList } from "@/services/api";

type Row = Record<string, string | number | null | undefined>;

function countBy(rows: Row[], key: string, val: string) {
  return rows.filter((r) => String(r[key] || "").toLowerCase() === val).length;
}

const cardConfig = [
  {
    key: "devis",
    title: "Devis",
    resource: "quotes",
    description: "Demandes de prix et estimations de budget envoyées depuis le formulaire public.",
    href: "/admin/modules/devis",
    icon: FaFileSignature,
    color: "from-orange-500 to-amber-400",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    pending: "pending",
  },
  {
    key: "rdv",
    title: "Rendez-vous",
    resource: "appointments",
    description: "Créneaux d'intervention demandés par les clients, à confirmer manuellement.",
    href: "/admin/modules/rendez-vous",
    icon: FaCalendarCheck,
    color: "from-blue-600 to-indigo-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    pending: "pending",
  },
  {
    key: "messages",
    title: "Messages",
    resource: "contacts",
    description: "Questions et prises de contact envoyées depuis les formulaires du site.",
    href: "/admin/modules/messages",
    icon: FaEnvelope,
    color: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    pending: "new",
  },
  {
    key: "candidatures",
    title: "Candidatures",
    resource: "applications",
    description: "Postulations reçues via la page recrutement pour les postes d'agents d'entretien.",
    href: "/admin/modules/recrutement",
    icon: FaBriefcase,
    color: "from-purple-600 to-fuchsia-500",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    pending: "nouveau",
  },
];

export default function AdminRequestsPage() {
  const [data, setData] = useState<Record<string, Row[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const resources = ["quotes", "appointments", "contacts", "applications"];
      const entries = await Promise.all(
        resources.map(async (r) => {
          try {
            return [r, await getList<Row>(r)] as const;
          } catch {
            return [r, [] as Row[]] as const;
          }
        })
      );
      setData(Object.fromEntries(entries));
      setLoading(false);
    }
    loadAll();
  }, []);

  const totals = {
    all: cardConfig.reduce((acc, c) => acc + (data[c.resource]?.length || 0), 0),
    pending: cardConfig.reduce(
      (acc, c) => acc + countBy(data[c.resource] || [], "status", c.pending),
      0
    ),
  };

  return (
    <AdminLayout>
      {/* Hero header */}
      <div className="mb-7 overflow-hidden rounded-2xl bg-gradient-to-br from-[#071f49] via-[#0b3a8f] to-[#1a56c4] p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-orange">
              <FaUsers className="text-[10px]" /> Centre de demandes CRM
            </span>
            <h1 className="mt-3 text-3xl font-black">Toutes les demandes</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/80">
              Centralisez et suivez toutes les demandes clients : devis, rendez-vous, messages et candidatures en un seul endroit.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {loading ? (
              <div className="h-16 w-36 animate-pulse rounded-xl bg-white/10" />
            ) : (
              <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
                <span className="block text-4xl font-black text-white">{totals.all}</span>
                <span className="mt-0.5 block text-xs font-bold text-blue-100/80">
                  demandes au total
                </span>
              </div>
            )}
            {totals.pending > 0 && !loading && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-3 py-1.5 text-xs font-black text-amber-200">
                <FaHourglassHalf className="text-amber-300" />
                {totals.pending} en attente de traitement
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cardConfig.map(({ key, title, resource, description, href, icon: Icon, color, bg, text, border, pending }) => {
          const rows = data[resource] || [];
          const total = rows.length;
          const pendingCount = countBy(rows, "status", pending);
          const doneCount = rows.length - pendingCount;

          return (
            <Link
              key={key}
              href={href}
              className={`group relative overflow-hidden rounded-2xl border ${border} bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Top gradient bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${color}`} />

              <div className="p-5">
                {/* Icon + title */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${bg} ${text} transition group-hover:scale-110`}>
                    <Icon className="text-xl" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-12 animate-pulse rounded-lg bg-slate-100" />
                  ) : (
                    <div className="text-right">
                      <span className="block text-3xl font-black text-slate-900">{total}</span>
                      <span className="text-[11px] font-semibold text-slate-400">total</span>
                    </div>
                  )}
                </div>

                <h2 className="mt-4 text-lg font-black text-slate-900">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>

                {/* Mini stats bar */}
                {!loading && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className={`rounded-lg ${bg} p-2 text-center`}>
                      <span className={`block text-lg font-black ${text}`}>{pendingCount}</span>
                      <span className="text-[10px] font-bold text-slate-500">en attente</span>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 text-center">
                      <span className="block text-lg font-black text-slate-700">{doneCount}</span>
                      <span className="text-[10px] font-bold text-slate-400">traités</span>
                    </div>
                  </div>
                )}

                <span className={`mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${text} group-hover:gap-2.5 transition-all`}>
                  Gérer les {title.toLowerCase()}
                  <span className="text-base">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent activity summary */}
      {!loading && totals.all > 0 && (
        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Résumé d&apos;activité</h2>
          <p className="mt-1 text-sm text-slate-500">
            Vue globale de l&apos;état de traitement de toutes vos demandes.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "À traiter",
                count: totals.pending,
                icon: FaHourglassHalf,
                color: "bg-amber-50 text-amber-700 border-amber-200",
              },
              {
                label: "Traités / confirmés",
                count: totals.all - totals.pending,
                icon: FaCheckCircle,
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
              {
                label: "Total reçus",
                count: totals.all,
                icon: FaUsers,
                color: "bg-blue-50 text-blue-700 border-blue-200",
              },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className={`flex items-center gap-4 rounded-xl border p-4 ${color}`}>
                <Icon className="text-xl shrink-0" />
                <div>
                  <span className="block text-2xl font-black">{count}</span>
                  <span className="text-xs font-semibold">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
