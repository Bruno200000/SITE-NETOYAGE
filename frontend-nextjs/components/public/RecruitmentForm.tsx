"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaCheckCircle, FaFileAlt, FaFileUpload, FaPaperPlane, FaTimes, FaUserTie } from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import { createRecord } from "@/services/api";

const canadaRecruitmentSchema = z.object({
  name: z.string().trim().min(2, "Nom complet requis (au moins 2 caractères)."),
  email: z.string().trim().email("Adresse courriel valide requise."),
  phone: z.string().trim().min(7, "Numéro de téléphone requis (ex: 514 623 5610)."),
  address: z.string().trim().min(3, "Adresse civique requise (rue, numéro d'appartement)."),
  city: z.string().trim().min(2, "Ville requise (ex: Moncton, Dieppe, Montréal)."),
  postal_code: z.string().trim().min(3, "Code postal requis (ex: E1C 1A1)."),
  position: z.string().trim().min(2, "Veuillez préciser le poste visé (ou candidature spontanée)."),
  availability: z.string().min(1, "Veuillez sélectionner votre disponibilité."),
  message: z.string().trim().min(10, "Présentation requise (au moins 10 caractères : expérience, permis, véhicule...).")
});

type CanadaRecruitmentInput = z.infer<typeof canadaRecruitmentSchema>;

const canadaAvailabilities = [
  "Temps plein (35-40h/semaine)",
  "Temps partiel (15-25h/semaine)",
  "Fins de semaine (Samedi / Dimanche)",
  "Soirs et nuits",
  "Sur appel / Horaires flexibles",
  "Immédiate"
];

interface RecruitmentFormProps {
  jobs?: string[];
  defaultPosition?: string;
  onJobChange?: (title: string) => void;
}

export function RecruitmentForm({ jobs = [], defaultPosition = "", onJobChange }: RecruitmentFormProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CanadaRecruitmentInput>({
    resolver: zodResolver(canadaRecruitmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      position: defaultPosition, // Left empty by default as requested
      availability: "",
      message: ""
    }
  });

  const selectedPosition = watch("position");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|png|jpg|jpeg)$/i)) {
      setCvError("Format non accepté. Veuillez téléverser un fichier PDF ou Word (DOC, DOCX).");
      setCvFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCvError("Fichier trop volumineux. La taille maximale autorisée est de 10 Mo.");
      setCvFile(null);
      return;
    }

    setCvError(null);
    setCvFile(file);
  }

  function removeCvFile() {
    setCvFile(null);
    setCvError(null);
  }

  async function uploadCvToServer(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append("cv", file);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost/SITE%20NETOYAGE/api";
      const res = await fetch(`${apiBase.replace(/\/$/, "")}/upload-cv`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data?.path || file.name;
      }
    } catch {
      // Fallback gracefully
    }
    return file.name;
  }

  async function onSubmit(values: CanadaRecruitmentInput) {
    try {
      setUploadingCv(true);
      let cvPath: string | null = null;
      if (cvFile) {
        cvPath = await uploadCvToServer(cvFile);
      }

      await createRecord("applications", {
        fullname: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        poste: values.position.trim(),
        adresse: values.address.trim(),
        ville: values.city.trim(),
        code_postal: values.postal_code.trim().toUpperCase(),
        dispo: values.availability,
        message: values.message.trim(),
        cv_file: cvPath,
        status: "nouveau"
      });

      reset();
      setCvFile(null);
      Swal.fire({
        icon: "success",
        title: "Candidature transmise avec succès !",
        html: `
          <div style="text-align: left; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 10px;">
            <p>Merci <strong>${values.name}</strong>, votre dossier de candidature a bien été enregistré.</p>
            <p style="margin-top: 8px;"><strong>Poste visé :</strong> ${values.position}</p>
            <p><strong>Lieu :</strong> ${values.city}, ${values.postal_code.toUpperCase()}</p>
            ${cvFile ? `<p style="margin-top: 8px; color: #16a34a;">✅ CV joint : <strong>${cvFile.name}</strong></p>` : ""}
            <p style="font-size: 12px; color: #64748b; margin-top: 12px;">Notre équipe des ressources humaines prendra contact avec vous rapidement par téléphone ou par courriel.</p>
          </div>
        `,
        confirmButtonColor: "#ff7a1a",
        confirmButtonText: "Compris, merci"
      });
    } catch (err) {
      const text =
        err instanceof Error && err.message && err.message !== "Une erreur est survenue."
          ? err.message
          : "Vérifiez que votre connexion est active puis réessayez.";
      Swal.fire({
        icon: "error",
        title: "Envoi impossible",
        text,
        confirmButtonColor: "#ff7a1a"
      });
    } finally {
      setUploadingCv(false);
    }
  }

  const fieldClass = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100";
  const labelClass = "block text-xs font-black uppercase tracking-wider text-brand-ink mb-1.5";

  return (
    <form
      id="formulaire-candidature"
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-premium space-y-5"
    >
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-black uppercase tracking-wider mb-1">
          <FaUserTie /> Formulaire d&apos;embauche — 2JK Services (Canada)
        </div>
        <h3 className="text-2xl font-black text-brand-ink">Déposer votre candidature</h3>
        <p className="mt-1 text-xs text-slate-500">
          Renseignez vos coordonnées canadiennes. Tous les champs marqués d&apos;un * sont nécessaires pour traiter votre dossier.
        </p>
      </div>

      {/* Row 1: Nom et Courriel */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Nom complet *</label>
          <input
            {...register("name")}
            className={fieldClass}
            placeholder="Ex. Jean Tremblay"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600 font-bold">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Adresse courriel *</label>
          <input
            {...register("email")}
            type="email"
            className={fieldClass}
            placeholder="jean.tremblay@exemple.ca"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600 font-bold">{errors.email.message}</p>}
        </div>
      </div>

      {/* Row 2: Téléphone et Adresse Civique */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Numéro de téléphone *</label>
          <input
            {...register("phone")}
            type="tel"
            className={fieldClass}
            placeholder="Ex. 514 623 5610 ou 506 000 0000"
            autoComplete="tel"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600 font-bold">{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Adresse civique *</label>
          <input
            {...register("address")}
            className={fieldClass}
            placeholder="Ex. 125 rue Main, Apt 3"
            autoComplete="street-address"
          />
          {errors.address && <p className="mt-1 text-xs text-red-600 font-bold">{errors.address.message}</p>}
        </div>
      </div>

      {/* Row 3: Ville & Province et Code postal canadien */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Ville &amp; Province *</label>
          <input
            {...register("city")}
            className={fieldClass}
            placeholder="Ex. Moncton, NB (ou Dieppe, Montréal...)"
            autoComplete="address-level2"
          />
          {errors.city && <p className="mt-1 text-xs text-red-600 font-bold">{errors.city.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Code postal canadien *</label>
          <input
            {...register("postal_code")}
            className={fieldClass}
            placeholder="Ex. E1C 1A1"
            autoComplete="postal-code"
          />
          {errors.postal_code && <p className="mt-1 text-xs text-red-600 font-bold">{errors.postal_code.message}</p>}
        </div>
      </div>

      {/* Row 4: Poste visé (laissé libre et vide) et Disponibilités */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-brand-ink">
              Poste visé *
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Saisie libre</span>
          </div>
          <input
            {...register("position")}
            className={fieldClass}
            placeholder="Ex. Agent d'entretien, Nettoyeur auto mobile, Candidature spontanée..."
          />
          {errors.position && <p className="mt-1 text-xs text-red-600 font-bold">{errors.position.message}</p>}
          <div className="mt-1.5 flex flex-wrap gap-1">
            <span className="text-[10px] text-slate-400 mr-1 self-center">Suggestions :</span>
            {["Candidature spontanée", "Nettoyage automobile", "Entretien résidentiel", "Entretien commercial"].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setValue("position", suggestion, { shouldValidate: true });
                  onJobChange?.(suggestion);
                }}
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${selectedPosition === suggestion ? "bg-brand-orange text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Disponibilités *</label>
          <select {...register("availability")} className={`${fieldClass} bg-white`}>
            <option value="">Sélectionnez votre disponibilité</option>
            {canadaAvailabilities.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {errors.availability && <p className="mt-1 text-xs text-red-600 font-bold">{errors.availability.message}</p>}
        </div>
      </div>

      {/* Row 5: Présentation du candidat */}
      <div>
        <label className={labelClass}>Présentation &amp; Motivations *</label>
        <textarea
          {...register("message")}
          rows={3}
          className={fieldClass}
          placeholder="Présentez-vous en quelques lignes : vos expériences professionnelles, permis de conduire valide (classe 5), possession d'un véhicule, langues parlées et motivations à rejoindre 2JK Services..."
        />
        {errors.message && <p className="mt-1 text-xs text-red-600 font-bold">{errors.message.message}</p>}
      </div>

      {/* Row 6: Téléversement du CV */}
      <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-4 transition hover:border-brand-orange/60">
        <label className={labelClass}>Téléverser votre Curriculum Vitae (CV)</label>
        
        {!cvFile ? (
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <FaFileUpload className="text-3xl text-brand-orange mb-2" />
            <p className="text-xs font-bold text-slate-700">
              Glissez votre fichier ici ou cliquez pour choisir
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Formats acceptés : PDF, DOC, DOCX (Max 10 Mo)
            </p>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-1.5 text-xs font-bold text-brand-navy shadow-sm hover:bg-slate-50 transition">
              <span>Parcourir mes fichiers</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-lg">
                <FaFileAlt />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">{cvFile.name}</p>
                <p className="text-[10px] text-slate-400">{(cvFile.size / 1024).toFixed(0)} Ko • Prêt pour l&apos;envoi</p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeCvFile}
              className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-red-500 transition"
              title="Supprimer ce fichier"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        )}

        {cvError && <p className="mt-2 text-xs text-red-600 font-bold">{cvError}</p>}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || uploadingCv}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-black text-white shadow-glow transition hover:bg-orange-600 hover:-translate-y-0.5 disabled:opacity-60"
        >
          <FaPaperPlane />
          {isSubmitting || uploadingCv ? "Envoi de votre candidature..." : "Envoyer ma candidature"}
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Vos informations sont traitées en toute confidentialité dans le cadre exclusif de notre processus de recrutement au Canada.
        </p>
      </div>
    </form>
  );
}
