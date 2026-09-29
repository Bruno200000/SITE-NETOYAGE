"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaBell, FaBriefcase, FaCalendarCheck, FaChartLine, FaChevronDown, FaCog, FaEnvelope, FaFileSignature, FaGlobe, FaImages, FaMapMarkedAlt, FaNewspaper, FaQuestionCircle, FaQuoteLeft, FaSignOutAlt, FaSoap, FaTags, FaTimes, FaUsers } from "react-icons/fa";
import type { IconType } from "react-icons";
import { useAuth } from "@/context/AuthContext";
import { hasAdminToken, isStoredAdmin, shouldProtectAdminPath } from "@/lib/authMiddleware";
import { api, getList } from "@/services/api";

type AdminChildLink = [string, string, IconType, boolean?];
type AdminGroup = {
  label: string;
  icon: IconType;
  href?: string;
  adminOnly?: boolean;
  children?: AdminChildLink[];
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at?: string;
};

const groups: AdminGroup[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: FaChartLine },
  { label: "Notifications", href: "/admin/notifications", icon: FaBell },
  {
    label: "Contenu",
    icon: FaNewspaper,
    children: [
      ["Services", "/admin/modules/services", FaSoap],
      ["Blog", "/admin/modules/blog", FaNewspaper],
      ["Categories blog", "/admin/modules/blog-categories", FaTags],
      ["Galerie", "/admin/modules/galerie", FaImages],
      ["Albums", "/admin/modules/albums", FaImages],
      ["Categories galerie", "/admin/modules/gallery-categories", FaTags],
      ["Avant / Apres", "/admin/modules/avant-apres", FaImages],
      ["Temoignages", "/admin/modules/temoignages", FaQuoteLeft],
      ["FAQ", "/admin/modules/faq", FaQuestionCircle]
    ]
  },
  {
    label: "Demandes",
    icon: FaUsers,
    children: [
      ["Toutes les demandes", "/admin/modules/demandes", FaUsers],
      ["Devis", "/admin/modules/devis", FaFileSignature],
      ["Rendez-vous", "/admin/modules/rendez-vous", FaCalendarCheck],
      ["Messages", "/admin/modules/messages", FaEnvelope],
      ["Transactions", "/admin/modules/transactions", FaFileSignature],
      ["Recrutement", "/admin/modules/recrutement", FaBriefcase]
    ]
  },
  {
    label: "Administration",
    icon: FaCog,
    children: [
      ["Acces utilisateurs", "/admin/modules/comptes", FaUsers, true],
      ["Carte Canada", "/admin/modules/carte-canada", FaMapMarkedAlt, true],
      ["Parametres", "/admin/modules/parametres", FaCog, true]
    ]
  }
];

const adminHrefs = groups.flatMap((group) => group.href ? [group.href] : group.children?.map(([, href]) => href) || []);

function isGroupActive(pathname: string, group: AdminGroup): boolean {
  if (group.href) return pathname === group.href || pathname.startsWith(`${group.href}/`);
  return Boolean(group.children?.some(([, href]) => pathname === href.split("#")[0]));
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, isAdmin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Contenu: true, Demandes: true });
  const previousUnreadCount = useRef(0);
  // Hydratation SSR: afficher tous les liens cote serveur, puis restreindre
  // cote client si l'utilisateur n'est pas administrateur.
  const showAdminOnly = !mounted || isAdmin || isStoredAdmin();
  const visibleGroups = groups
    .map((group) => {
      if (group.adminOnly && !showAdminOnly) return null;
      if (!group.children) return group;
      const children = group.children.filter((child) => (child[3] ? showAdminOnly : true));
      if (!children.length) return null;
      return { ...group, children };
    })
    .filter((group): group is AdminGroup => group !== null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (shouldProtectAdminPath(pathname) && !hasAdminToken()) {
      router.replace("/admin/login");
    }
    adminHrefs.forEach((href) => router.prefetch(href));
  }, [pathname, router]);

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  async function loadNotifications() {
    try {
      const data = await getList<NotificationItem>("notifications");
      setNotifications(data);
    } catch {
      setNotifications([]);
    }
  }

  function playNotificationSound() {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const audio = new AudioContextClass();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audio.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(660, audio.currentTime + 0.16);
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.22);

      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.24);
    } catch {
      // Browsers may block audio before the first user interaction.
    }
  }

  useEffect(() => {
    if (hasAdminToken()) {
      loadNotifications();
      const timer = window.setInterval(loadNotifications, 30000);
      return () => window.clearInterval(timer);
    }
  }, []);

  async function markNotificationRead(item: NotificationItem) {
    try {
      await api.patch(`/notifications/${item.id}`, { is_read: 1 });
      setNotifications((current) => current.map((notification) => notification.id === item.id ? { ...notification, is_read: 1 } : notification));
    } catch {
      setNotifications((current) => current.map((notification) => notification.id === item.id ? { ...notification, is_read: 1 } : notification));
    }
  }

  async function deleteNotification(item: NotificationItem) {
    try {
      await api.delete(`/notifications/${item.id}`);
      setNotifications((current) => current.filter((notification) => notification.id !== item.id));
    } catch {
      setNotifications((current) => current.filter((notification) => notification.id !== item.id));
    }
  }

  const unreadCount = notifications.filter((item) => Number(item.is_read) === 0).length;

  useEffect(() => {
    if (unreadCount > previousUnreadCount.current && previousUnreadCount.current !== 0) {
      playNotificationSound();
    }
    previousUnreadCount.current = unreadCount;
  }, [unreadCount]);

  const sidebar = (
    <aside className={`${collapsed ? "w-20" : "w-72"} h-full bg-[#071f49] text-white shadow-2xl transition-all duration-300`}>
      <div className={`flex h-20 items-center border-b border-white/10 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-md bg-white p-1">
            <img src="/logo-2jk.jpg" alt="2JK Services Inc." className="h-full w-full object-contain" />
          </span>
          {!collapsed ? (
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black">2JK Admin</h1>
              <p className="text-xs font-semibold text-blue-100/70">Cleaning ERP</p>
            </div>
          ) : null}
        </Link>
        {!collapsed ? (
          <button type="button" onClick={() => setCollapsed(true)} className="grid h-9 w-9 place-items-center rounded-md bg-white/10 hover:bg-white/15" aria-label="Reduire le menu">
            <FaBars />
          </button>
        ) : null}
      </div>

      <nav className="grid gap-2 px-3 py-5">
        {collapsed ? (
          <button type="button" onClick={() => setCollapsed(false)} className="mb-2 grid h-11 w-full place-items-center rounded-md bg-white/10 hover:bg-white/15" aria-label="Ouvrir le menu">
            <FaBars />
          </button>
        ) : null}

        {visibleGroups.map((group) => {
          const Icon = group.icon;
          const active = isGroupActive(pathname, group);
          const opened = openGroups[group.label] ?? false;

          if (group.href) {
            return (
              <Link key={group.label} href={group.href} className={`group relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition ${active ? "bg-white text-[#0b3a8f]" : "text-blue-50 hover:bg-white/10 hover:text-white"}`}>
                <Icon className={active ? "text-brand-orange" : "text-blue-100"} />
                {!collapsed ? <span>{group.label}</span> : <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-slate-950 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100">{group.label}</span>}
              </Link>
            );
          }

          return (
            <div key={group.label} className="group relative">
              <button
                type="button"
                onClick={() => collapsed ? setCollapsed(false) : setOpenGroups((current) => ({ ...current, [group.label]: !opened }))}
                className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-semibold transition ${active ? "bg-white/16 text-white" : "text-blue-50 hover:bg-white/10 hover:text-white"}`}
              >
                <span className="flex items-center gap-3"><Icon className="text-blue-100" /> {!collapsed ? group.label : null}</span>
                {!collapsed ? <FaChevronDown className={`text-xs transition ${opened ? "rotate-180" : ""}`} /> : null}
              </button>

              {collapsed ? (
                <div className="pointer-events-none absolute left-full top-0 z-50 ml-3 min-w-56 rounded-xl bg-white p-2 text-slate-800 opacity-0 shadow-2xl ring-1 ring-slate-200 transition group-hover:pointer-events-auto group-hover:opacity-100">
                  <p className="px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-400">{group.label}</p>
                  {group.children?.map(([label, href, ChildIcon]) => (
                    <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold hover:bg-blue-50 hover:text-[#0b3a8f]">
                      <ChildIcon /> {label}
                    </Link>
                  ))}
                </div>
              ) : null}

              {!collapsed && opened ? (
                <div className="mt-2 grid gap-1 rounded-xl bg-blue-950/22 p-2">
                  {group.children?.map(([label, href, ChildIcon]) => {
                    const childActive = pathname === href.split("#")[0];
                    return (
                      <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${childActive ? "bg-white text-[#0b3a8f]" : "text-blue-50/82 hover:bg-white/10 hover:text-white"}`}>
                        <ChildIcon className={childActive ? "text-brand-orange" : "text-blue-100/80"} /> {label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="admin-shell min-h-screen text-slate-900">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Fermer le menu" className="absolute inset-0 bg-slate-950/55" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-72">{sidebar}</div>
        </div>
      ) : null}

      <div className={collapsed ? "lg:pl-20" : "lg:pl-72"}>
        <header className={`fixed right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#071f49] px-5 text-white shadow-lg shadow-blue-950/10 md:px-8 ${collapsed ? "left-0 lg:left-20" : "left-0 lg:left-72"}`}>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white lg:hidden">
              <FaBars />
            </button>
            <div>
              <h2 className="text-xl font-black text-white">Superadmin Dashboard</h2>
              <p className="text-xs font-semibold text-blue-100/75">Gestion complete du site 2JK Services</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden items-center gap-2 rounded-md border border-white/15 bg-white/8 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/14 md:inline-flex">
              <FaGlobe /> Voir le site
            </Link>
            <div className="relative">
              <button type="button" onClick={() => { setNotificationsOpen((value) => !value); loadNotifications(); }} className="relative grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15" aria-label="Notifications">
                <FaBell />
                {unreadCount ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-orange px-1 text-[10px] font-black text-white">{unreadCount}</span> : null}
              </button>
              {notificationsOpen ? (
                <div className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-xl border border-blue-100 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-blue-50 px-4 py-3">
                    <div>
                      <h3 className="font-black text-slate-950">Notifications</h3>
                      <p className="text-xs text-slate-500">{unreadCount} non lue(s)</p>
                    </div>
                    <Link href="/admin/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs font-black text-[#0b3a8f] hover:underline">Tout voir</Link>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.slice(0, 5).map((item) => (
                      <div key={item.id} className={`mb-2 rounded-lg p-3 text-left transition hover:bg-blue-50 ${Number(item.is_read) === 0 ? "bg-orange-50" : "bg-slate-50"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <button type="button" onClick={() => markNotificationRead(item)} className="min-w-0 flex-1 text-left">
                            <p className="font-black text-slate-900">{item.title}</p>
                            <p className="mt-1 text-sm leading-5 text-slate-600">{item.message}</p>
                          </button>
                          <button type="button" onClick={() => deleteNotification(item)} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-slate-400 transition hover:bg-red-50 hover:text-red-600" aria-label="Supprimer la notification">
                            <FaTimes />
                          </button>
                        </div>
                        {Number(item.is_read) === 0 ? <span className="mt-2 inline-flex rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-black uppercase text-white">nouveau</span> : null}
                      </div>
                    ))}
                    {!notifications.length ? <p className="px-3 py-6 text-center text-sm text-slate-500">Aucune notification.</p> : null}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="hidden rounded-md border border-white/15 bg-white/10 px-4 py-2 md:block" suppressHydrationWarning>
              <p className="text-sm font-black text-white">{mounted ? admin?.name || "Super Admin" : "Super Admin"}</p>
              <p className="text-xs text-blue-100/75">
                {mounted ? [admin?.email || "Administrateur", admin?.role === "admin" ? "Admin" : admin?.role === "editor" ? "Editeur" : ""].filter(Boolean).join(" - ") : "Administrateur"}
              </p>
            </div>
            <button type="button" onClick={handleLogout} className="hidden items-center gap-2 rounded-md bg-brand-orange px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-600 sm:flex">
              <FaSignOutAlt /> Deconnexion
            </button>
          </div>
        </header>
        <main className="admin-content p-5 pt-24 md:p-8 md:pt-28">{children}</main>
      </div>
    </div>
  );
}
