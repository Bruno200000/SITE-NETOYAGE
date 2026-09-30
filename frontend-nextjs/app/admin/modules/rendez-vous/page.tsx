"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { AppointmentAvailabilityManager } from "@/components/admin/AppointmentAvailabilityManager";
import { CrudTable } from "@/components/admin/CrudTable";
import { FaCalendarCheck, FaClock, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function AdminAppointmentsPage() {
  return (
    <AdminLayout>
      {/* Info banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
              <FaCalendarCheck className="text-lg" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Gestion des rendez-vous d&apos;intervention
              </h3>
              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                Confirmez ou replanifiez les créneaux demandés par les clients. Chaque rendez-vous confirmé déclenche une notification au client.
              </p>
            </div>
          </div>

          {/* Workflow statuses */}
          <div className="grid shrink-0 gap-2 sm:grid-cols-4">
            {[
              { label: "En attente", color: "bg-amber-100 text-amber-700", emoji: "⏳" },
              { label: "Confirmé", color: "bg-blue-100 text-blue-700", emoji: "✅" },
              { label: "Terminé", color: "bg-emerald-100 text-emerald-700", emoji: "🏁" },
              { label: "Annulé", color: "bg-slate-100 text-slate-600", emoji: "❌" },
            ].map(({ label, color, emoji }) => (
              <span key={label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black whitespace-nowrap ${color}`}>
                <span>{emoji}</span> {label}
              </span>
            ))}
          </div>
        </div>

        {/* Tips row */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaClock className="mt-0.5 shrink-0 text-brand-orange" />
            <div>
              <p className="text-[11px] font-black uppercase text-slate-700">Créneaux standard</p>
              <p className="mt-1 flex flex-wrap gap-1">
                {timeSlots.map((s) => (
                  <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700">
                    {s}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <FaMapMarkerAlt className="mt-0.5 shrink-0 text-blue-500" />
            <div>
              <p className="text-[11px] font-black uppercase text-slate-700">Zones desservies</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Nouveau-Brunswick : Moncton, Dieppe, Riverview, Fredericton, Sussex, Shediac et environs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <FaInfoCircle className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-[11px] text-blue-900/80">
              <strong>Conseil :</strong> Confirmez les RDV dans les 4h suivant la réception pour maximiser la satisfaction client.
            </p>
          </div>
        </div>
      </div>

      <AppointmentAvailabilityManager />

      <CrudTable
        title="Rendez-vous"
        resource="appointments"
        description="Créneaux d'intervention planifiés par les clients. Confirmez, replanifiez ou annulez selon vos disponibilités."
        fields={[
          { name: "name", label: "Nom du client", required: true, placeholder: "Prénom et nom complet" },
          { name: "email", label: "Adresse e-mail", required: true, type: "email", placeholder: "client@email.com" },
          { name: "phone", label: "Téléphone de contact", required: true, type: "tel", placeholder: "Ex: 506 234 5678" },
          { name: "address", label: "Adresse d'intervention", placeholder: "Adresse complète : rue, ville, province, code postal" },
          { name: "service_id", label: "Service concerné", placeholder: "Ex: Nettoyage résidentiel, Commercial, Après travaux..." },
          { name: "appointment_date", label: "Date du rendez-vous", required: true, type: "date" },
          { name: "appointment_time", label: "Heure souhaitée", required: true, type: "time" },
          {
            name: "message",
            label: "Détails et consignes",
            type: "textarea",
            placeholder: "Type de prestation, superficie, accès au logement, consignes particulières...",
          },
          {
            name: "status",
            label: "Statut du rendez-vous",
            type: "select",
            options: [
              { label: "⏳ En attente de confirmation", value: "pending" },
              { label: "✅ Confirmé (client notifié)", value: "confirmed" },
              { label: "🏁 Intervention terminée", value: "completed" },
              { label: "❌ Annulé", value: "cancelled" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
