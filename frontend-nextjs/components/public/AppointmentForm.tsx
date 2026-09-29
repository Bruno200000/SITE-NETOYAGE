"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { createRecord, getList } from "@/services/api";
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

export function AppointmentForm() {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<AppointmentInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_id: defaultServices[0]?.id ? String(defaultServices[0].id) : ""
    }
  });
  const [services, setServices] = useState<ServiceOption[]>(defaultServices);
  const [servicesLoading, setServicesLoading] = useState(false);
  const selectedTime = watch("appointment_time");

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

  // Calculate tomorrow's date string (YYYY-MM-DD)
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

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
      
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`2JK Services - ${chosenService}`)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(`Intervention réservée avec 2JK Services Inc.\nService: ${chosenService}\nNom client: ${values.name}\nTéléphone: ${values.phone}\nCourriel: ${values.email}\nAdresse: ${values.address}\nDétails: ${values.message}`)}&location=${encodeURIComponent(values.address)}`;

      reset();
      Swal.fire({
        icon: "success",
        title: "Rendez-vous confirmé !",
        html: `
          <div style="text-align: left; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 10px;">
            <p><strong>Prestation :</strong> ${chosenService}</p>
            <p><strong>Date & Heure :</strong> ${values.appointment_date} à ${values.appointment_time}</p>
            <p><strong>Lieu :</strong> ${values.address}</p>
            <div style="margin-top: 18px; text-align: center;">
              <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                📅 Ajouter directement à mon Google Agenda
              </a>
            </div>
            <p style="font-size: 11px; color: #64748b; margin-top: 12px; text-align: center;">Un courriel et un SMS de confirmation vous seront également transmis.</p>
          </div>
        `,
        confirmButtonColor: "#ff7a1a",
        confirmButtonText: "Parfait, merci"
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Demande impossible",
        text: "Vérifiez votre connexion puis réessayez, ou appelez-nous directement.",
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
        <p className="mt-1 text-sm text-slate-500">Les réservations sont disponibles à partir de demain dès 8h00.</p>
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
          <input
            {...register("appointment_date")}
            min={minDate}
            className={`${fieldClass} w-full mt-1`}
            type="date"
          />
          {errors.appointment_date ? (
            <p className="mt-1 text-xs text-red-600 font-bold">{errors.appointment_date.message}</p>
          ) : (
            <span className="mt-1 block text-[11px] text-slate-400">Date minimale : {minDate}</span>
          )}
        </div>
        <div>
          <label className={labelClass}>Heure souhaitée *</label>
          <input {...register("appointment_time")} className={`${fieldClass} w-full mt-1`} type="time" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["08:30", "10:30", "13:30", "15:30", "17:30"].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setValue("appointment_time", slot, { shouldValidate: true })}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${selectedTime === slot ? "bg-brand-orange text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                {slot}
              </button>
            ))}
          </div>
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
        disabled={isSubmitting}
        className="rounded-xl bg-brand-orange px-5 py-3 font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-60"
      >
        {isSubmitting ? "Envoi en cours..." : "Confirmer la demande"}
      </button>
    </form>
  );
}
