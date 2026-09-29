"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaPaperPlane, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import { createRecord } from "@/services/api";

const schema = z.object({
  client_name: z.string().min(2, "Nom requis"),
  profession: z.string().optional(),
  rating: z.string().min(1, "Note requise"),
  comment: z.string().min(10, "Votre témoignage doit contenir au moins 10 caractères")
});

type TestimonialInput = z.infer<typeof schema>;

export function TestimonialForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TestimonialInput>({
    resolver: zodResolver(schema),
    defaultValues: { rating: "5" }
  });

  async function onSubmit(values: TestimonialInput) {
    try {
      await createRecord("testimonials", {
        client_name: values.client_name,
        profession: values.profession || "",
        rating: Number(values.rating),
        comment: values.comment,
        status: "pending"
      });
      reset({ rating: "5" });
      Swal.fire({
        icon: "success",
        title: "Merci pour votre témoignage !",
        text: "Il sera visible sur le site après validation par l'administration.",
        confirmButtonColor: "#ff7a1a"
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Envoi impossible",
        text: "Vérifiez votre connexion puis réessayez.",
        confirmButtonColor: "#ff7a1a"
      });
    }
  }

  const inputClass = "w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-950 placeholder:text-slate-500 shadow-sm outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-500/20";
  const labelClass = "block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="reveal-up rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-premium">
      <div className="border-b border-slate-100 pb-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-brand-orange">
          <FaStar /> Votre avis
        </span>
        <h2 className="mt-3 text-2xl font-black text-brand-navy">Partager un témoignage</h2>
        <p className="mt-1 text-sm text-slate-600">Votre avis sera envoyé au back-office pour validation.</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Nom complet *</label>
          <input {...register("client_name")} className={inputClass} placeholder="Votre nom" />
          {errors.client_name ? <p className="mt-1 text-xs font-bold text-red-600">{errors.client_name.message}</p> : null}
        </div>
        <div>
          <label className={labelClass}>Profession</label>
          <input {...register("profession")} className={inputClass} placeholder="Ex: Gestionnaire, particulier..." />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>Note *</label>
        <select {...register("rating")} className={inputClass}>
          <option value="5">5 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="2">2 étoiles</option>
          <option value="1">1 étoile</option>
        </select>
        {errors.rating ? <p className="mt-1 text-xs font-bold text-red-600">{errors.rating.message}</p> : null}
      </div>

      <div className="mt-4">
        <label className={labelClass}>Témoignage *</label>
        <textarea {...register("comment")} rows={4} className={`${inputClass} resize-none`} placeholder="Décrivez votre expérience avec 2JK Services..." />
        {errors.comment ? <p className="mt-1 text-xs font-bold text-red-600">{errors.comment.message}</p> : null}
      </div>

      <button type="submit" disabled={isSubmitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 text-sm font-black text-white shadow-md transition hover:bg-orange-600 disabled:opacity-60">
        <FaPaperPlane className="text-xs" />
        {isSubmitting ? "Envoi en cours..." : "Envoyer mon témoignage"}
      </button>
    </form>
  );
}
