"use client";

import { useEffect, useMemo, useState } from "react";
import { FaBell, FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api, getList } from "@/services/api";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at?: string;
};

type Period = "all" | "today" | "week" | "month";

function inPeriod(item: NotificationItem, period: Period) {
  if (period === "all") return true;
  if (!item.created_at) return false;
  const created = new Date(String(item.created_at).replace(" ", "T"));
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  if (period === "today") return created.toDateString() === now.toDateString();
  if (period === "week") return diffMs <= 7 * 24 * 60 * 60 * 1000;
  return diffMs <= 31 * 24 * 60 * 60 * 1000;
}

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [period, setPeriod] = useState<Period>("all");
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    setLoading(true);
    try {
      setItems(await getList<NotificationItem>("notifications"));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const filtered = useMemo(() => items.filter((item) => inPeriod(item, period)), [items, period]);
  const unreadCount = filtered.filter((item) => Number(item.is_read) === 0).length;

  async function markRead(item: NotificationItem) {
    try {
      await api.patch(`/notifications/${item.id}`, { is_read: 1 });
      setItems((current) => current.map((notification) => notification.id === item.id ? { ...notification, is_read: 1 } : notification));
    } catch {
      Swal.fire({ icon: "error", title: "Action impossible", confirmButtonColor: "#0b3a8f" });
    }
  }

  async function deleteItem(item: NotificationItem) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Supprimer cette notification ?",
      text: item.title,
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626"
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/notifications/${item.id}`);
      setItems((current) => current.filter((notification) => notification.id !== item.id));
    } catch {
      Swal.fire({ icon: "error", title: "Suppression impossible", confirmButtonColor: "#0b3a8f" });
    }
  }

  async function createNotification() {
    const result = await Swal.fire({
      title: "Nouvelle notification",
      html: `
        <input id="notif-title" class="admin-form-control" placeholder="Titre">
        <textarea id="notif-message" class="admin-form-control admin-form-textarea" placeholder="Message"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Creer",
      confirmButtonColor: "#0b3a8f",
      preConfirm: () => {
        const title = (document.getElementById("notif-title") as HTMLInputElement | null)?.value;
        const message = (document.getElementById("notif-message") as HTMLTextAreaElement | null)?.value;
        if (!title || !message) {
          Swal.showValidationMessage("Titre et message requis.");
          return false;
        }
        return { title, message, type: "info", is_read: 0 };
      }
    });
    if (!result.isConfirmed || !result.value) return;
    try {
      await api.post("/notifications", result.value);
      await loadNotifications();
    } catch {
      Swal.fire({ icon: "error", title: "Creation impossible", confirmButtonColor: "#0b3a8f" });
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Notifications</h1>
          <p className="mt-2 text-slate-600">{unreadCount} non lue(s) dans la periode selectionnee.</p>
        </div>
        <button type="button" onClick={createNotification} className="inline-flex items-center gap-2 rounded-md bg-[#0b3a8f] px-4 py-3 text-sm font-black text-white transition hover:bg-blue-950">
          <FaPlus /> Nouvelle notification
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ["all", "Toutes"],
          ["today", "Aujourd'hui"],
          ["week", "7 jours"],
          ["month", "30 jours"]
        ].map(([value, label]) => (
          <button key={value} type="button" onClick={() => setPeriod(value as Period)} className={`rounded-full px-4 py-2 text-sm font-black transition ${period === value ? "bg-[#0b3a8f] text-white" : "bg-white text-[#0b3a8f] ring-1 ring-blue-100 hover:bg-blue-50"}`}>
            {label}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-blue-100 bg-white shadow-sm">
        <div className="grid gap-3 p-5">
          {loading ? <p className="py-8 text-center text-slate-500">Chargement...</p> : null}
          {!loading && filtered.map((item) => (
            <article key={item.id} className={`flex gap-4 rounded-xl border p-4 transition hover:shadow-sm ${Number(item.is_read) === 0 ? "border-orange-100 bg-orange-50" : "border-blue-100 bg-white"}`}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0b3a8f]"><FaBell /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-black text-slate-950">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => markRead(item)} className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100" aria-label="Marquer comme lu"><FaCheck /></button>
                    <button type="button" onClick={() => deleteItem(item)} className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100" aria-label="Supprimer"><FaTimes /></button>
                  </div>
                </div>
                <p className="mt-3 text-xs font-bold text-slate-400">{item.created_at || "Date inconnue"} - {item.type}</p>
              </div>
            </article>
          ))}
          {!loading && !filtered.length ? <p className="py-10 text-center text-slate-500">Aucune notification pour cette periode.</p> : null}
        </div>
      </section>
    </AdminLayout>
  );
}
