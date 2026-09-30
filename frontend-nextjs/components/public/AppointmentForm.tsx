"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { api, createRecord, getList } from "@/services/api";
import { publicServices } from "@/data/site";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Adresse email valide requise"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  service_id: z.string().min(1, "Veuillez sélectionner un service"),
  appointment_date: z.string().min(1, "Date requise").refine((val) => {
    if (!val) return false;
    const selected = new Date(val + "T00:00:00");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return selected >= tomorrow;
  }, { message: "La date d'intervention doit être au minimum à partir de demain." }),
  appointment_time: z.string().min(1, "Heure requise"),
  address: z.string().min(5, "Adresse complète requise"),
  message: z.string().min(5, "Veuillez préciser quelques détails (5 caractères min.)")
});

type AppointmentInput = z.infer<typeof schema>;
type AppointmentAvailability = {
  available_days: number[];
  start_time: string;
  end_time: string;
  slot_minutes: number;
  closed_dates: string[];
  booked_slots: Array<{ date: string; time: string }>;
};
type ServiceOption = {
  id: number | string;
  title: string;
  status?: string;
};

const defaultServices: ServiceOption[] = publicServices.map((service, index) => ({
  id: service.slug || String(index + 1),
  title: service.title,
  status: "active"
}));

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getTimeSlots(availability: AppointmentAvailability | null): string[] {
  if (!availability) return [];
  const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  const slots: string[] = [];
  const start = toMinutes(availability.start_time);
  const end = toMinutes(availability.end_time);
  for (let minute = start; minute + availability.slot_minutes <= end; minute += availability.slot_minutes) {
    slots.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
  }
  return slots;
}

export function AppointmentForm() {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<AppointmentInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_id: defaultServices[0]?.id ? String(defaultServices[0].id) : ""
    }
  });
  const [services, setServices] = useState<ServiceOption[]>(defaultServices);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [availability, setAvailability] = useState<AppointmentAvailability | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1);
  });
  const selectedTime = watch("appointment_time");
  const selectedDate = watch("appointment_date");

  useEffect(() => {
    let mounted = true;

    getList<ServiceOption>("services")
      .then((items) => {
        if (!mounted) return;
        const active = items.filter((service) => String(service.status || "active") === "active");
        if (active.length > 0) {
          setServices(active);
        }
      })
      .catch(() => {
        // Keeps defaultServices from publicServices
      })
      .finally(() => {
        if (mounted) setServicesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    api.get<unknown, { data: AppointmentAvailability }>("/appointments/availability")
      .then((response) => {
        if (mounted) setAvailability(response.data);
      })
      .catch((error: unknown) => {
        if (mounted) setAvailabilityError(error instanceof Error ? error.message : "Les disponibilités sont temporairement indisponibles.");
      })
      .finally(() => {
        if (mounted) setAvailabilityLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Calculate tomorrow's date string (YYYY-MM-DD)
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const maxDate = useMemo(() => {
    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() + 120);
    return formatDateKey(lastDate);
  }, []);
  const timeSlots = useMemo(() => getTimeSlots(availability), [availability]);
  const bookedSlots = useMemo(
    () => new Set((availability?.booked_slots || []).map((slot) => `${slot.date}|${slot.time.slice(0, 5)}`)),
    [availability]
  );

  function isDateAvailable(date: Date): boolean {
    if (!availability) return false;
    const dateKey = formatDateKey(date);
    const weekday = date.getDay() === 0 ? 7 : date.getDay();
    return dateKey >= minDate && dateKey <= maxDate
      && availability.available_days.includes(weekday)
      && !availability.closed_dates.includes(dateKey)
      && timeSlots.some((slot) => !bookedSlots.has(`${dateKey}|${slot}`));
  }

  const firstAvailableMonth = new Date(Number(minDate.slice(0, 4)), Number(minDate.slice(5, 7)) - 1, 1);
  const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  const canGoBack = calendarMonth > firstAvailableMonth;
  const canGoForward = formatDateKey(nextMonth) <= maxDate;
  const monthOffset = (new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const day = index - monthOffset + 1;
    return day > 0 && day <= daysInMonth ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day) : null;
  });

  function chooseDate(date: Date) {
    const dateKey = formatDateKey(date);
    setValue("appointment_date", dateKey, { shouldValidate: true, shouldDirty: true });
    setValue("appointment_time", "", { shouldValidate: true, shouldDirty: true });
  }

  async function onSubmit(values: AppointmentInput) {
    try {
      await createRecord("appointments", values);
      const chosenService = services.find((s) => String(s.id) === String(values.service_id))?.title || "Intervention de nettoyage";
      const cleanDate = values.appointment_date.replace(/-/g, "");
      const cleanTime = values.appointment_time.replace(":", "") + "00";
      const startIso = `${cleanDate}T${cleanTime}`;
      const endHour = String(Math.min(23, Number(values.appointment_time.split(":")[0] || 10) + 2)).padStart(2, "0");
      const endMinute = values.appointment_time.split(":")[1] || "00";
      const endIso = `${cleanDate}T${endHour}${endMinute}00`;
      
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Demande 2JK Services - ${chosenService}`)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(`Demande de rendez-vous envoyée à 2JK Services Inc.\nService: ${chosenService}\nNom client: ${values.name}\nTéléphone: ${values.phone}\nCourriel: ${values.email}\nAdresse: ${values.address}\nDétails: ${values.message}`)}&location=${encodeURIComponent(values.address)}`;

      reset();
      Swal.fire({
        icon: "success",
        title: "Demande envoyée !",
        html: `
          <div style="text-align: left; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 10px;">
            <p><strong>Prestation :</strong> ${chosenService}</p>
              <p><strong>Date demandée :</strong> ${values.appointment_date} à ${values.appointment_time}</p>
            <p><strong>Lieu :</strong> ${values.address}</p>
            <div style="margin-top: 18px; text-align: center;">
              <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                📅 Ajouter directement à mon Google Agenda
              </a>
            </div>
            <p style="font-size: 11px; color: #64748b; margin-top: 12px; text-align: center;">Notre équipe vous contactera pour confirmer le rendez-vous.</p>
          </div>
        `,
        confirmButtonColor: "#ff7a1a",
        confirmButtonText: "Compris"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Demande impossible",
        text: error instanceof Error ? error.message : "Vérifiez votre connexion puis réessayez, ou appelez-nous directement.",
        confirmButtonColor: "#ff7a1a"
      });
    }
  }

  const fieldClass = "rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100";
  const labelClass = "grid gap-1.5 text-xs font-black uppercase tracking-wider text-brand-ink";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-6 md:p-7 shadow-premium">
      <div>
        <h3 className="text-2xl font-black text-brand-ink">Planifier un rendez-vous</h3>
        <p className="mt-1 text-sm text-slate-500">Les créneaux libres sont mis à jour selon le calendrier des interventions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Nom complet *</label>
          <input {...register("name")} className={`${fieldClass} w-full mt-1`} placeholder="Votre nom" />
          {errors.name && <p className="mt-1 text-xs text-red-600 font-bold">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Téléphone *</label>
          <input {...register("phone")} className={`${fieldClass} w-full mt-1`} placeholder="Votre téléphone" />
          {errors.phone && <p className="mt-1 text-xs text-red-600 font-bold">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Adresse e-mail *</label>
        <input {...register("email")} className={`${fieldClass} w-full mt-1`} placeholder="name@example.com" />
        {errors.email && <p className="mt-1 text-xs text-red-600 font-bold">{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Service souhaité *</label>
        <select {...register("service_id")} className={`${fieldClass} w-full mt-1 font-medium bg-white`}>
          <option value="" disabled>Choisir un service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.title}</option>
          ))}
        </select>
        {errors.service_id && <p className="mt-1 text-xs text-red-600 font-bold">{errors.service_id.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Date souhaitée * (dès demain)</label>
          <input type="hidden" {...register("appointment_date")} />
          <div className="mt-1 rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <button type="button" aria-label="Mois précédent" disabled={!canGoBack} onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30">‹</button>
              <span className="font-bold capitalize text-slate-800">{calendarMonth.toLocaleDateString("fr-CA", { month: "long", year: "numeric" })}</span>
              <button type="button" aria-label="Mois suivant" disabled={!canGoForward} onClick={() => setCalendarMonth(nextMonth)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30">›</button>
            </div>
            <div role="grid" aria-label="Choisir une date" className="grid grid-cols-7 gap-1 text-center">
              {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`} role="columnheader" className="py-1 text-xs font-bold text-slate-400">{day}</span>)}
              {calendarCells.map((date, index) => {
                if (!date) return <span key={`empty-${index}`} aria-hidden="true" />;
                const dateKey = formatDateKey(date);
                const available = isDateAvailable(date);
                const selected = selectedDate === dateKey;
                return (
                  <button
                    key={dateKey}
                    type="button"
                    role="gridcell"
                    aria-label={date.toLocaleDateString("fr-CA", { dateStyle: "full" })}
                    aria-selected={selected}
                    disabled={!available || availabilityLoading}
                    onClick={() => chooseDate(date)}
                    className={`aspect-square rounded-md text-sm font-semibold transition ${selected ? "bg-brand-orange text-white" : available ? "text-slate-700 hover:bg-orange-50 hover:text-brand-ink" : "cursor-not-allowed bg-slate-50 text-slate-300"}`}
                  >{date.getDate()}</button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {availabilityLoading ? "Chargement des disponibilités…" : availabilityError || "Les jours complets et les jours fermés sont désactivés."}
            </p>
          </div>
          {errors.appointment_date ? (
            <p className="mt-1 text-xs text-red-600 font-bold">{errors.appointment_date.message}</p>
          ) : (
            <span className="mt-1 block text-[11px] text-slate-400">Date sélectionnée : {selectedDate || "aucune"}</span>
          )}
        </div>
        <div>
          <label className={labelClass}>Heure souhaitée *</label>
          <input type="hidden" {...register("appointment_time")} />
          <div className="mt-1 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {timeSlots.map((slot) => {
              const occupied = selectedDate ? bookedSlots.has(`${selectedDate}|${slot}`) : false;
              return (
              <button
                key={slot}
                type="button"
                disabled={!selectedDate || occupied || availabilityLoading}
                aria-pressed={selectedTime === slot}
                title={occupied ? "Créneau déjà réservé" : undefined}
                onClick={() => setValue("appointment_time", slot, { shouldValidate: true, shouldDirty: true })}
                className={`min-h-10 rounded-md px-2 py-2 text-xs font-bold transition ${selectedTime === slot ? "bg-brand-orange text-white" : occupied || !selectedDate ? "cursor-not-allowed bg-slate-100 text-slate-300 line-through" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                {slot}{occupied ? " · Réservé" : ""}
              </button>
              );
            })}
          </div>
          {selectedDate && !timeSlots.some((slot) => !bookedSlots.has(`${selectedDate}|${slot}`)) && <p className="mt-2 text-xs font-semibold text-slate-500">Aucune heure disponible ce jour. Choisissez une autre date.</p>}
          {!selectedDate && <p className="mt-2 text-xs text-slate-500">Choisissez d’abord une date disponible.</p>}
          {errors.appointment_time && <p className="mt-1 text-xs text-red-600 font-bold">{errors.appointment_time.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Adresse d&apos;intervention *</label>
        <input {...register("address")} className={`${fieldClass} w-full mt-1`} placeholder="Adresse complète de l'intervention" />
        {errors.address && <p className="mt-1 text-xs text-red-600 font-bold">{errors.address.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Détails de la demande *</label>
        <textarea
          {...register("message")}
          rows={3}
          className={`${fieldClass} w-full mt-1`}
          placeholder="Type d'espace, superficie, urgence, consignes d'accès..."
        />
        {errors.message && <p className="mt-1 text-xs text-red-600 font-bold">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || availabilityLoading || !availability}
        className="rounded-xl bg-brand-orange px-5 py-3 font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-60"
      >
        {isSubmitting ? "Envoi en cours..." : "Confirmer la demande"}
      </button>
    </form>
  );
}
