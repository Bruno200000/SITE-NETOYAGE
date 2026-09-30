"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaCalendarTimes, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { api } from "@/services/api";

type AppointmentSchedule = {
  available_days: number[];
  start_time: string;
  end_time: string;
  slot_minutes: number;
  closed_dates: string[];
};

const weekDays = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" },
  { value: 5, label: "Ven" },
  { value: 6, label: "Sam" },
  { value: 7, label: "Dim" },
];

function tomorrowDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function AppointmentAvailabilityManager() {
  const [schedule, setSchedule] = useState<AppointmentSchedule>({
    available_days: [1, 2, 3, 4, 5],
    start_time: "08:00",
    end_time: "17:00",
    slot_minutes: 60,
    closed_dates: [],
  });
  const [closedDate, setClosedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    api.get<unknown, { data: AppointmentSchedule }>("/appointments/availability")
      .then((response) => {
        if (mounted) setSchedule(response.data);
      })
      .catch((error: unknown) => {
        if (mounted) setLoadError(error instanceof Error ? error.message : "Chargement des disponibilités impossible.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function toggleDay(day: number) {
    setSchedule((current) => {
      const enabled = current.available_days.includes(day);
      if (enabled && current.available_days.length === 1) return current;
      return {
        ...current,
        available_days: enabled
          ? current.available_days.filter((value) => value !== day)
          : [...current.available_days, day].sort((left, right) => left - right),
      };
    });
  }

  function addClosedDate() {
    if (!closedDate || schedule.closed_dates.includes(closedDate)) return;
    setSchedule((current) => ({
      ...current,
      closed_dates: [...current.closed_dates, closedDate].sort(),
    }));
    setClosedDate("");
  }

  async function saveSchedule() {
    setSaving(true);
    setLoadError("");
    try {
      const response = await api.put<unknown, { data: AppointmentSchedule }>("/appointments/availability", schedule);
      setSchedule(response.data);
      Swal.fire({ icon: "success", title: "Disponibilités enregistrées", timer: 1600, showConfirmButton: false });
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100";

  return (
    <section className="mb-6 border-y border-slate-200 bg-white py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
            <FaCalendarTimes className="text-blue-600" /> Disponibilités de réservation
          </h2>
          <p className="mt-1 text-sm text-slate-500">Les changements s’appliquent immédiatement au calendrier public.</p>
        </div>
        <button
          type="button"
          onClick={saveSchedule}
          disabled={loading || saving}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaSave /> {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      {loadError && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{loadError}</p>}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr_1.2fr]">
        <fieldset disabled={loading || saving}>
          <legend className="mb-2 text-xs font-black uppercase text-slate-600">Jours disponibles</legend>
          <div className="flex flex-wrap gap-2">
            {weekDays.map(({ value, label }) => {
              const active = schedule.available_days.includes(value);
              return (
                <label key={value} className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-semibold ${active ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-500"}`}>
                  <input type="checkbox" checked={active} onChange={() => toggleDay(value)} />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset disabled={loading || saving}>
          <legend className="mb-2 text-xs font-black uppercase text-slate-600">Heures de service</legend>
          <div className="flex flex-wrap items-center gap-2">
            <label className="grid gap-1 text-xs text-slate-500">De<input aria-label="Heure de début" className={inputClass} type="time" value={schedule.start_time} onChange={(event) => setSchedule((current) => ({ ...current, start_time: event.target.value }))} /></label>
            <label className="grid gap-1 text-xs text-slate-500">À<input aria-label="Heure de fin" className={inputClass} type="time" value={schedule.end_time} onChange={(event) => setSchedule((current) => ({ ...current, end_time: event.target.value }))} /></label>
            <label className="grid gap-1 text-xs text-slate-500">Intervalle<select aria-label="Durée des créneaux" className={inputClass} value={schedule.slot_minutes} onChange={(event) => setSchedule((current) => ({ ...current, slot_minutes: Number(event.target.value) }))}>
              {[30, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} min</option>)}
            </select></label>
          </div>
        </fieldset>

        <fieldset disabled={loading || saving}>
          <legend className="mb-2 text-xs font-black uppercase text-slate-600">Dates fermées</legend>
          <div className="flex gap-2">
            <input aria-label="Ajouter une date fermée" className={`${inputClass} min-w-0 flex-1`} type="date" min={tomorrowDate()} value={closedDate} onChange={(event) => setClosedDate(event.target.value)} />
            <button type="button" onClick={addClosedDate} disabled={!closedDate} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"><FaPlus /> Ajouter</button>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {schedule.closed_dates.map((date) => (
              <li key={date} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {date}
                <button type="button" aria-label={`Retirer la fermeture du ${date}`} onClick={() => setSchedule((current) => ({ ...current, closed_dates: current.closed_dates.filter((item) => item !== date) }))} className="text-slate-500 hover:text-rose-700"><FaTimes /></button>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
    </section>
  );
}