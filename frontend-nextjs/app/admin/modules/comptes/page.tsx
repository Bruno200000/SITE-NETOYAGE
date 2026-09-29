"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { useAuth } from "@/context/AuthContext";

export default function AdminAccountsPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [mounted, isAdmin, router]);

  // Rendu serveur deterministe (anti-hydration mismatch), verif role cote client.
  if (!mounted) {
    return (
      <AdminLayout>
        <section className="admin-panel p-8 text-center text-sm text-slate-500">Chargement des acces utilisateurs...</section>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <section className="admin-panel mx-auto max-w-xl p-8 text-center">
          <FaShieldAlt className="mx-auto text-4xl text-brand-orange" />
          <h1 className="mt-4 text-2xl font-black text-slate-950">Acces reserve a l&apos;administrateur</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Votre compte editeur ne peut pas gerer les acces utilisateurs. Seul un compte avec le role <strong>admin</strong> peut
            creer, modifier ou desactiver des comptes.
          </p>
          <Link href="/admin/dashboard" className="admin-btn admin-btn-primary mx-auto mt-6">
            <FaArrowLeft /> Retour au dashboard
          </Link>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CrudTable
        title="Acces utilisateurs"
        resource="users"
        description="Seul l'administrateur peut creer des comptes admin / editeur, reinitialiser les mots de passe et activer / desactiver les acces."
        fields={[
          { name: "name", label: "Nom complet", required: true },
          { name: "email", label: "Adresse e-mail", required: true, type: "email" },
          { name: "password", label: "Mot de passe", type: "password", placeholder: "Minimum 8 caracteres. Laisser vide en modification." },
          { name: "role", label: "Role", required: true, type: "select", options: [{ label: "Administrateur (acces total)", value: "admin" }, { label: "Editeur (sans acces utilisateurs)", value: "editor" }] },
          { name: "status", label: "Statut", required: true, type: "select", options: [{ label: "Actif", value: "active" }, { label: "Inactif (acces bloque)", value: "inactive" }] },
          { name: "avatar", label: "Avatar / image du compte", type: "image" }
        ]}
      />
    </AdminLayout>
  );
}
