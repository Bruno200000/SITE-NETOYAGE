"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheckCircle, FaEye, FaEyeSlash, FaGoogle, FaLock, FaShieldAlt, FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import { company } from "@/data/site";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
type LoginInput = z.infer<typeof schema>;

const benefits = [
  "Gardez le controle total des demandes, devis et rendez-vous",
  "Gerez les services, la galerie, le blog et les temoignages",
  "Suivez les messages clients et les contenus du site"
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@2jkservices.com", password: "" }
  });

  async function onSubmit(values: LoginInput) {
    setError("");
    try {
      await login(values.email, values.password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible. Verifiez l'email, le mot de passe et l'API.");
    }
  }

  function fillLocalAdmin() {
    setValue("email", "admin@2jkservices.com", { shouldValidate: true });
    setValue("password", "Admin@12345", { shouldValidate: true });
    setError("");
  }

  return (
    <main className="fixed inset-0 grid h-svh overflow-hidden bg-slate-950 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative isolate hidden overflow-hidden bg-brand-ink px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,99,206,0.30),transparent_38%),radial-gradient(circle_at_78%_16%,rgba(255,122,26,0.26),transparent_24%),linear-gradient(180deg,rgba(22,163,74,0.14),transparent_48%)]" />
        <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-lg border border-white/10 bg-white/8" />
        <div className="absolute right-12 top-10 h-40 w-40 rotate-45 rounded-lg border-[34px] border-white/8" />
        <div className="absolute bottom-16 right-16 h-28 w-28 rounded-full border border-brand-orange/40" />

        <div className="relative flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-white p-1.5 shadow-glow">
            <img src="/logo-2jk.jpg" alt={company.name} className="h-full w-full object-contain" />
          </span>
          <span>
            <span className="block text-xl font-black">{company.name}</span>
            <span className="text-xs font-black uppercase tracking-[0.24em] text-brand-mint">Admin console</span>
          </span>
        </div>

        <div className="relative max-w-xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/85">
            <FaShieldAlt className="text-brand-orange" /> Acces securise
          </span>
          <h1 className="text-balance text-4xl font-black leading-tight xl:text-5xl">Pilotez le site 2JK depuis un espace clair et fiable.</h1>
          <div className="mt-8 grid gap-5">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex gap-4 rounded-lg border border-white/10 bg-white/8 p-4 text-sm font-semibold leading-6 text-white/88 backdrop-blur">
                <FaCheckCircle className="mt-1 shrink-0 text-brand-orange" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href="/contact" className="relative inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-md bg-brand-orange px-6 py-4 font-black text-white shadow-glow transition hover:bg-orange-600">
          <FaUserPlus /> Demander un acces
        </Link>
      </section>

      <section className="relative grid min-h-0 place-items-center overflow-hidden bg-[linear-gradient(180deg,#f8fbff,#eef7ff)] px-5 py-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-green to-brand-orange" />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[430px] rounded-lg border border-white/70 bg-white/92 p-6 shadow-premium backdrop-blur md:p-7">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-white p-1 shadow-premium ring-1 ring-slate-100">
              <img src="/logo-2jk.jpg" alt={company.name} className="h-full w-full object-contain" />
            </span>
            <span className="font-black text-brand-ink">{company.name}</span>
          </div>

          <div className="mb-7">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-lg bg-brand-blue text-xl text-white shadow-premium">
              <FaLock />
            </div>
            <h2 className="text-3xl font-black text-slate-950">Connexion admin</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Accedez au back-office securise de 2JK Services Inc.</p>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-semibold text-slate-950">
              Adresse e-mail
              <input {...register("email")} className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-100" placeholder="name@example.com" />
            </label>
            {errors.email ? <small className="text-red-600">Adresse e-mail invalide.</small> : null}

            <label className="grid gap-2 text-sm font-semibold text-slate-950">
              Mot de passe
              <span className="flex h-11 items-center rounded-md border border-slate-300 bg-white focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-100">
                <input {...register("password")} className="h-full min-w-0 flex-1 rounded-md px-3 outline-none" placeholder="********" type={showPassword ? "text" : "password"} />
                <button type="button" className="grid h-full w-11 place-items-center text-slate-700" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>
            {errors.password ? <small className="text-red-600">Le mot de passe doit contenir au moins 8 caracteres.</small> : null}

            <p className="text-sm text-slate-700">Mot de passe oublie ? <Link href="/contact" className="font-semibold text-brand-blue hover:underline">Recuperer</Link></p>

            <button
              type="button"
              onClick={fillLocalAdmin}
              className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-left text-xs font-bold leading-5 text-blue-800 transition hover:bg-blue-100"
            >
              Utiliser le compte admin local : admin@2jkservices.com / Admin@12345
            </button>

            {error ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

            <button disabled={isSubmitting} type="submit" className="mt-3 h-12 rounded-md bg-brand-blue px-5 font-black text-white shadow-premium transition hover:bg-brand-navy disabled:opacity-60">
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>

            <div className="mt-2 flex items-center gap-4 text-xs font-bold text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>OU</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={() => Swal.fire({ icon: "info", title: "Google non configure", text: "La connexion Google pourra etre branchee avec OAuth.", confirmButtonColor: "#0b63ce" })}
              className="flex h-11 items-center justify-center gap-3 rounded-md border border-slate-300 bg-white font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              <FaGoogle className="text-brand-orange" /> Se connecter avec Google
            </button>

            <p className="text-center text-sm text-slate-600">Vous n'avez pas de compte ? <Link href="/contact" className="font-black text-brand-blue underline">Demander un acces</Link></p>
          </div>
        </form>
      </section>
    </main>
  );
}
