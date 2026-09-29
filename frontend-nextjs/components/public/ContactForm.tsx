"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { createRecord } from "@/services/api";
import { FaPaperPlane } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Adresse email valide requise"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  message: z.string().min(10, "Message d'au moins 10 caractères requis")
});

type ContactInput = z.infer<typeof schema>;

export function ContactForm({ endpoint = "contacts" }: { endpoint?: string }) {
  const { t } = useLanguage();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(schema)
  });

  async function onSubmit(values: ContactInput) {
    try {
      await createRecord(endpoint, values);
      reset();
      Swal.fire({
        icon: "success",
        title: t("contact.form.success_title"),
        text: t("contact.form.success_text"),
        confirmButtonColor: "#ff7a1a"
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: t("contact.form.error_title"),
        text: t("contact.form.error_text"),
        confirmButtonColor: "#ff7a1a"
      });
    }
  }

  const inputClass = "w-full rounded-xl border-2 border-slate-400 bg-white px-4 py-2.5 text-sm font-medium text-slate-950 placeholder:text-slate-500 shadow-sm outline-none transition duration-200 hover:border-slate-600 focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-blue-500/20";
  const labelClass = "block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl border-2 border-slate-300 bg-white p-6 shadow-md">
      <div className="border-b border-slate-200 pb-3">
        <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-brand-orange border border-orange-200">
          {t("contact.form.badge")}
        </span>
        <h3 className="mt-2 text-xl font-black text-slate-950">{t("contact.form.title")}</h3>
        <p className="mt-1 text-xs font-medium text-slate-600">{t("contact.form.subtitle")}</p>
      </div>

      <div>
        <label className={labelClass}>{t("contact.form.name")}</label>
        <input
          {...register("name")}
          className={inputClass}
          placeholder={t("contact.form.name_placeholder")}
        />
        {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>{t("contact.form.email")}</label>
        <input
          {...register("email")}
          type="email"
          className={inputClass}
          placeholder={t("contact.form.email_placeholder")}
        />
        {errors.email && <p className="mt-1 text-xs font-bold text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>{t("contact.form.phone")}</label>
        <input
          {...register("phone")}
          type="tel"
          className={inputClass}
          placeholder={t("contact.form.phone_placeholder")}
        />
        {errors.phone && <p className="mt-1 text-xs font-bold text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <label className={labelClass}>{t("contact.form.message")}</label>
        <textarea
          {...register("message")}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder={t("contact.form.message_placeholder")}
        />
        {errors.message && <p className="mt-1 text-xs font-bold text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 text-sm font-black text-white shadow-md transition duration-200 hover:bg-orange-600 hover:shadow-glow disabled:opacity-60"
      >
        <FaPaperPlane className="text-xs" />
        {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
      </button>

      <p className="text-center text-xs font-semibold text-slate-500">
        {t("contact.form.privacy")}
      </p>
    </form>
  );
}
