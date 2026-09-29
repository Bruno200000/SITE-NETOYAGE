import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-sky p-6 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-brand-green">404</p>
        <h1 className="mt-3 text-5xl font-black text-brand-navy">Page introuvable</h1>
        <Link className="mt-8 inline-flex rounded-md bg-brand-blue px-5 py-3 font-bold text-white" href="/">Retour à l'accueil</Link>
      </div>
    </main>
  );
}
