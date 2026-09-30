"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaCheck,
  FaTimes,
  FaCloudUploadAlt,
  FaImage,
  FaWrench,
  FaCalendarCheck,
  FaStar,
  FaBriefcase,
  FaFileInvoiceDollar,
  FaCog,
  FaBroom,
  FaCar,
  FaExclamationTriangle,
  FaChevronDown,
} from "react-icons/fa";
import { api, getList, invalidateList } from "@/services/api";

type Row = Record<string, string | number | undefined | null>;

export type CrudField = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "number" | "date" | "time" | "textarea" | "select" | "url" | "password" | "image";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  badge?: string;
  span?: 1 | 2;
};

type CrudTableProps = {
  title: string;
  rows?: Row[];
  resource?: string;
  description?: string;
  fields?: CrudField[];
};

const defaultFields: CrudField[] = [
  { name: "title", label: "Titre", required: true },
  { name: "status", label: "Statut", type: "select", options: [{ label: "Actif", value: "active" }, { label: "Inactif", value: "inactive" }] }
];

const statusLabels: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
  published: "Publié",
  draft: "Brouillon",
  scheduled: "Planifié",
  confirmed: "Confirmé",
  completed: "Terminé",
  processed: "Traité",
  cancelled: "Annulé",
  archived: "Archivé",
  new: "Nouveau",
  nouveau: "Nouveau",
  contacte: "Contacté",
  entretien: "Entretien",
  accepte: "Accepté",
  refuse: "Refusé"
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost/SITE%20NETOYAGE/api";

function mediaUrl(value: unknown): string {
  const path = String(value || "");
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/") || path.startsWith("data:")) return path;
  return `${apiBase.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
}

function rowTitle(row: Row): string {
  return String(row.title || row.name || row.client_name || row.email || row.setting_key || row.question || `Élément #${row.id || ""}`);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getHeaderIcon(resource?: string, title?: string) {
  const text = `${resource || ""} ${title || ""}`.toLowerCase();
  if (text.includes("service")) return FaBroom;
  if (text.includes("auto") || text.includes("vehicule")) return FaCar;
  if (text.includes("avant") || text.includes("apres") || text.includes("galerie") || text.includes("album")) return FaImage;
  if (text.includes("rendez-vous") || text.includes("appointment")) return FaCalendarCheck;
  if (text.includes("recrutement") || text.includes("job") || text.includes("candidat")) return FaBriefcase;
  if (text.includes("devis") || text.includes("facture") || text.includes("quote")) return FaFileInvoiceDollar;
  if (text.includes("temoignage") || text.includes("avis")) return FaStar;
  if (text.includes("parametre") || text.includes("setting")) return FaCog;
  return FaWrench;
}

export function CrudTable({ title, rows = [], resource, description, fields = defaultFields }: CrudTableProps) {
  const [items, setItems] = useState<Row[]>(rows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fileMap, setFileMap] = useState<Record<string, File>>({});
  const [previewMap, setPreviewMap] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deletingRow, setDeletingRow] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function loadItems(force = false) {
    if (!resource) return;
    setLoading(true);
    try {
      const data = await getList<Row>(resource, force);
      setItems(data);
    } catch {
      setItems(rows);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const filtered = useMemo(() => {
    return items.filter((row) => {
      const haystack = JSON.stringify(row).toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesStatus = status === "all" || String(row.status || "actif").toLowerCase() === status;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, status]);

  const listFields = fields.filter((field) => field.type !== "password");

  // Open Create Modal
  function handleOpenCreate() {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.name === "status") {
        initialData.status = field.options?.[0]?.value || "active";
      } else if (field.name === "is_before_after") {
        initialData.is_before_after = "1";
      } else {
        initialData[field.name] = "";
      }
    });
    setFormData(initialData);
    setFormErrors({});
    setFileMap({});
    setPreviewMap({});
    setActiveRow(null);
    setModalMode("create");
  }

  // Open Edit Modal
  function handleOpenEdit(row: Row) {
    const initialData: Record<string, any> = { ...row };
    const previews: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.type === "image" && row[field.name]) {
        previews[field.name] = mediaUrl(row[field.name]);
      }
    });
    setFormData(initialData);
    setFormErrors({});
    setFileMap({});
    setPreviewMap(previews);
    setActiveRow(row);
    setModalMode("edit");
  }

  // Open View Modal
  function handleOpenView(row: Row) {
    setActiveRow(row);
    setModalMode("view");
  }

  // Close Modal
  function handleCloseModal() {
    if (submitting) return;
    setModalMode(null);
    setActiveRow(null);
    setFormErrors({});
  }

  // Handle Field Value Change
  function handleFieldChange(name: string, value: any) {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug when title changes if slug field exists
      if (name === "title" && fields.some((f) => f.name === "slug")) {
        const currentSlug = prev.slug || "";
        const prevSuggested = slugify(prev.title || "");
        if (!currentSlug || currentSlug === prevSuggested) {
          updated.slug = slugify(value);
        }
      }
      return updated;
    });
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  // Handle Image File Selection
  function handleFileChange(name: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileMap((prev) => ({ ...prev, [name]: file }));
    const objectUrl = URL.createObjectURL(file);
    setPreviewMap((prev) => ({ ...prev, [name]: objectUrl }));
    setFormData((prev) => ({ ...prev, [name]: "" })); // Clear manual URL
  }

  // Remove Selected Image
  function handleRemoveImage(name: string) {
    setFileMap((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setPreviewMap((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setFormData((prev) => ({ ...prev, [name]: "" }));
    if (fileInputRefs.current[name]) {
      fileInputRefs.current[name]!.value = "";
    }
  }

  // Upload an image file
  // IMPORTANT : ne jamais envoyer Content-Type: application/json avec FormData,
  // sinon PHP ne remplit pas $_FILES et l'API répond "Aucune image reçue." (erreur galerie).
  async function uploadImageFile(file: File, folderName: string): Promise<string> {
    const data = new FormData();
    data.append("file", file);
    data.append("folder", folderName || "media");
    const response = await api.post<unknown, { data: { path: string } }>("/upload", data, {
      headers: {},
    } as never);
    const envelope = response as unknown as { data?: { path?: string }; path?: string };
    const path = envelope?.data?.path ?? envelope?.path;
    if (!path) {
      throw new Error("Téléversement impossible : réponse API vide. Vérifiez que Apache est lancé et que vous êtes connecté en admin.");
    }
    return path;
  }

  // Submit Modal Form (Create or Edit)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      const val = formData[field.name];
      const hasFile = !!fileMap[field.name];
      if (field.required) {
        if (field.type === "image") {
          if (!val && !hasFile) {
            errors[field.name] = `${field.label} est obligatoire.`;
          }
        } else if (val === undefined || val === null || String(val).trim() === "") {
          errors[field.name] = `${field.label} est obligatoire.`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, any> = {};
      fields.forEach((field) => {
        if (formData[field.name] !== undefined) {
          payload[field.name] = formData[field.name];
        }
      });

      // Upload any new image files
      for (const field of fields) {
        if (field.type === "image") {
          if (fileMap[field.name]) {
            const uploadedPath = await uploadImageFile(fileMap[field.name], field.name || "media");
            payload[field.name] = uploadedPath;
          }
        } else if (field.type === "number") {
          if (payload[field.name] !== "" && payload[field.name] !== undefined && payload[field.name] !== null) {
            payload[field.name] = Number(payload[field.name]);
          } else {
            payload[field.name] = null;
          }
        }
      }

      // Safeguard for gallery / avant-apres
      if (resource === "gallery") {
        if (!payload.image) {
          payload.image = payload.after_image || payload.before_image || "uploads/media/default.jpg";
        }
        if (payload.is_before_after !== undefined) {
          payload.is_before_after = Number(payload.is_before_after) || 0;
        }
      }

      // Auto-generate slug ONLY if the resource actually has a slug field
      if (fields.some((f) => f.name === "slug") && !payload.slug) {
        const source = payload.title || payload.name || "";
        if (source) payload.slug = slugify(String(source));
      }

      if (modalMode === "create") {
        let created: Row = { id: Date.now(), ...payload };
        if (resource) {
          created = await api.post<unknown, Row>(`/${resource}`, payload);
          invalidateList(resource);
        }
        setItems((current) => [created.id ? created : { id: Date.now(), ...payload }, ...current]);
        await loadItems(true);
        handleCloseModal();
        Swal.fire({
          icon: "success",
          title: "Élément ajouté avec succès",
          timer: 1800,
          showConfirmButton: false
        });
      } else if (modalMode === "edit" && activeRow) {
        if (resource && activeRow.id) {
          await api.put(`/${resource}/${activeRow.id}`, payload);
          invalidateList(resource);
        }
        setItems((current) => current.map((item) => (item === activeRow ? { ...item, ...payload } : item)));
        await loadItems(true);
        handleCloseModal();
        Swal.fire({
          icon: "success",
          title: "Modifications enregistrées",
          timer: 1800,
          showConfirmButton: false
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Une erreur est survenue lors de l'enregistrement. Vérifiez vos données.";
      Swal.fire({
        icon: "error",
        title: "Échec de l'enregistrement",
        text: msg,
        confirmButtonColor: "#7c3aed"
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Delete Item Action
  async function handleDelete() {
    if (!deletingRow) return;
    setDeleting(true);
    try {
      if (resource && deletingRow.id) {
        await api.delete(`/${resource}/${deletingRow.id}`);
        invalidateList(resource);
      }
      setItems((current) => current.filter((item) => item !== deletingRow));
      setDeletingRow(null);
      Swal.fire({
        icon: "success",
        title: "Élément supprimé",
        timer: 1600,
        showConfirmButton: false
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Suppression impossible",
        confirmButtonColor: "#7c3aed"
      });
    } finally {
      setDeleting(false);
    }
  }

  const HeaderIcon = getHeaderIcon(resource, title);

  return (
    <>
      <section className="admin-panel overflow-hidden">
        {/* Table Header */}
        <div className="admin-panel-head flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="admin-kicker">Module d&apos;administration</span>
            <h1 className="mt-1 text-2xl font-black text-slate-950">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              {description || "Recherche, filtre et gestion en temps réel des éléments."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => loadItems(true)}
              className="admin-btn admin-btn-ghost"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} /> Actualiser
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="admin-btn !bg-purple-700 hover:!bg-purple-800 text-white font-bold shadow-md shadow-purple-900/10 flex items-center gap-2"
            >
              <FaPlus /> Ajouter
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="admin-filters grid gap-3 md:grid-cols-[1fr_190px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="admin-filter-control"
            placeholder="Recherche instantanée..."
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="admin-filter-control"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="pending">En attente</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="scheduled">Planifié</option>
            <option value="confirmed">Confirmé</option>
            <option value="completed">Terminé</option>
            <option value="processed">Traité</option>
            <option value="cancelled">Annulé</option>
            <option value="archived">Archivé</option>
            <option value="new">Nouveau</option>
          </select>
        </div>

        {/* Table Content */}
        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table w-full min-w-[1040px] text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr>
                {[...listFields.map((field) => field.label), "ID", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => (
                <tr key={`${row.id || index}-${rowTitle(row)}`} className="transition">
                  {listFields.map((field) => (
                    <td key={field.name} className="max-w-[260px] px-4 py-4 text-slate-700">
                      {field.type === "image" && row[field.name] ? (
                        <div className="relative group w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                          <img
                            src={mediaUrl(row[field.name])}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        </div>
                      ) : field.name === "status" ? (
                        <span className={`admin-status-pill ${String(row.status) === 'active' || String(row.status) === 'published' ? '!bg-purple-50 !text-purple-700 !border-purple-200' : ''}`}>
                          {statusLabels[String(row[field.name])] || String(row[field.name] || "-")}
                        </span>
                      ) : (
                        <span
                          className={`${
                            field.name === "title" || field.name === "name" || field.name === "client_name"
                              ? "font-bold text-slate-900"
                              : ""
                          } line-clamp-2`}
                        >
                          {row[field.name] !== undefined && row[field.name] !== null && row[field.name] !== ""
                            ? String(row[field.name])
                            : "-"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">{row.id || "-"}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenView(row)}
                        className="admin-icon-btn hover:!text-purple-600 hover:!border-purple-200"
                        title="Voir détails"
                      >
                        <FaEye />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(row)}
                        className="admin-icon-btn hover:!text-purple-600 hover:!border-purple-200"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingRow(row)}
                        className="admin-icon-btn admin-icon-btn-danger"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={listFields.length + 2} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaImage className="text-3xl text-slate-300" />
                      <p className="font-semibold text-sm text-slate-500">Aucun élément trouvé.</p>
                      <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="mt-2 text-xs font-bold text-purple-700 hover:underline"
                      >
                        + Ajouter un premier enregistrement
                      </button>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PREMIUM MODAL (CREATE / EDIT) INSPIRED BY THE IMAGE REFERENCE               */}
      {/* ========================================================================= */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-7 pt-7 pb-4 flex items-center justify-between border-b border-slate-100/80 shrink-0">
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center text-lg shadow-md shadow-purple-700/20 shrink-0">
                  <HeaderIcon />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {modalMode === "create" ? `Ajouter - ${title}` : `Modifier ${rowTitle(activeRow || {})}`}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {modalMode === "create"
                      ? "Renseignez les champs ci-dessous pour créer l'enregistrement."
                      : "Modifiez les informations puis cliquez sur Enregistrer."}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitting}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Fermer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-7 py-5 overflow-y-auto flex-1 space-y-6">
                {/* Section Header like MAINTENANCE DETAILS in image */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-4">
                    {title.toUpperCase()} — DÉTAILS DU FORMULAIRE
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => {
                      const isWide =
                        field.span === 2 ||
                        field.type === "textarea" ||
                        field.type === "image" ||
                        field.name.includes("description") ||
                        field.name.includes("content") ||
                        field.name.includes("message");

                      const hasError = formErrors[field.name];

                      return (
                        <div
                          key={field.name}
                          className={isWide ? "md:col-span-2 space-y-1.5" : "space-y-1.5"}
                        >
                          {/* Label */}
                          <label
                            htmlFor={`field-${field.name}`}
                            className="block text-xs font-semibold text-slate-700"
                          >
                            <span>{field.label}</span>
                            {field.required && <span className="text-purple-600 font-bold ml-1">*</span>}
                            {field.badge && (
                              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">
                                {field.badge}
                              </span>
                            )}
                          </label>

                          {/* Field Input Variant */}
                          {field.type === "textarea" ? (
                            <textarea
                              id={`field-${field.name}`}
                              value={formData[field.name] || ""}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder || `Décrivez ${field.label.toLowerCase()}...`}
                              rows={3}
                              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-[#fbfcfd] placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none transition-all duration-150 resize-y ${
                                hasError ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200"
                              }`}
                            />
                          ) : field.type === "select" ? (
                            <div className="relative">
                              <select
                                id={`field-${field.name}`}
                                value={formData[field.name] ?? ""}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                className={`w-full h-11 px-3.5 pr-10 py-2 rounded-xl border text-sm text-slate-800 bg-[#fbfcfd] focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none transition-all duration-150 appearance-none ${
                                  hasError ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200"
                                }`}
                              >
                                {(field.options || []).map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none" />
                            </div>
                          ) : field.type === "image" ? (
                            /* Premium Image Uploader Field */
                            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                {/* Image Preview Box */}
                                <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm group">
                                  {previewMap[field.name] || formData[field.name] ? (
                                    <>
                                      <img
                                        src={previewMap[field.name] || mediaUrl(formData[field.name])}
                                        alt="Aperçu"
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(field.name)}
                                        className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold gap-1"
                                      >
                                        <FaTimes /> Retirer
                                      </button>
                                    </>
                                  ) : (
                                    <div className="text-center p-2">
                                      <FaImage className="text-2xl text-slate-300 mx-auto mb-1" />
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Photo
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Upload Action Buttons */}
                                <div className="flex-1 w-full space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="file"
                                      ref={(el) => {
                                        fileInputRefs.current[field.name] = el;
                                      }}
                                      id={`file-${field.name}`}
                                      accept="image/png,image/jpeg,image/webp"
                                      onChange={(e) => handleFileChange(field.name, e)}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`file-${field.name}`}
                                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200/60 cursor-pointer transition-colors shadow-sm"
                                    >
                                      <FaCloudUploadAlt className="text-sm" />
                                      <span>Choisir un fichier...</span>
                                    </label>
                                    {fileMap[field.name] && (
                                      <span className="text-xs text-emerald-600 font-semibold truncate max-w-[150px]">
                                        ✓ {fileMap[field.name].name}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-tight">
                                    Formats acceptés: JPG, PNG, WebP. Poids max conseillé 5 Mo.
                                  </p>
                                </div>
                              </div>

                              {/* Manual URL input fallback */}
                              <div className="pt-2 border-t border-slate-200/60">
                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                  Ou renseigner directement une URL :
                                </label>
                                <input
                                  type="url"
                                  value={formData[field.name] || ""}
                                  onChange={(e) => {
                                    handleFieldChange(field.name, e.target.value);
                                    if (e.target.value) {
                                      setPreviewMap((prev) => ({ ...prev, [field.name]: e.target.value }));
                                    }
                                  }}
                                  placeholder="https://... ou uploads/image.jpg"
                                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          ) : (
                            /* Standard Inputs (text, number, date, time, email, etc.) */
                            <input
                              type={field.type || "text"}
                              id={`field-${field.name}`}
                              value={formData[field.name] ?? ""}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder || field.label}
                              className={`w-full h-11 px-3.5 py-2 rounded-xl border text-sm text-slate-800 bg-[#fbfcfd] placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none transition-all duration-150 ${
                                hasError ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200"
                              }`}
                            />
                          )}

                          {/* Error validation message */}
                          {hasError && (
                            <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                              <FaExclamationTriangle className="text-[10px]" /> {hasError}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Exactly like the Cancel & Schedule pair in the screenshot */}
              <div className="px-7 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-white hover:text-slate-800 transition active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  <FaTimes className="text-xs" />
                  <span>Annuler</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-purple-700/25 transition flex items-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <FaSyncAlt className="animate-spin text-xs" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-xs" />
                      <span>{modalMode === "create" ? "Ajouter" : "Enregistrer"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL VIEW MODAL                                                         */}
      {/* ========================================================================= */}
      {modalMode === "view" && activeRow && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-7 pt-7 pb-4 flex items-center justify-between border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center text-lg shadow-md shadow-purple-700/20 shrink-0">
                  <HeaderIcon />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {rowTitle(activeRow)}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Détail complet de l&apos;élément — {title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Content */}
            <div className="px-7 py-6 overflow-y-auto flex-1 space-y-6">
              {/* Media Preview if present */}
              {fields.some((f) => f.type === "image" && activeRow[f.name]) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields
                    .filter((f) => f.type === "image" && activeRow[f.name])
                    .map((field) => (
                      <div
                        key={field.name}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm"
                      >
                        <div className="h-44 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={mediaUrl(activeRow[field.name])}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 bg-white border-t border-slate-100">
                          <span className="text-xs font-bold text-slate-700">{field.label}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields
                  .filter((f) => f.type !== "image" && f.type !== "password")
                  .map((field) => (
                    <div
                      key={field.name}
                      className={`p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 ${
                        field.type === "textarea" ? "md:col-span-2" : ""
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {field.label}
                      </span>
                      {field.name === "cv_file" && activeRow[field.name] && (
                        <a href={mediaUrl(activeRow[field.name])} target="_blank" rel="noreferrer" download className="mt-2 mb-2 inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100">Ouvrir / télécharger le CV PDF</a>
                      )}
                      <p className="mt-1 text-sm font-semibold text-slate-800 whitespace-pre-wrap break-words">
                        {field.name === "status"
                          ? statusLabels[String(activeRow[field.name])] || String(activeRow[field.name] || "-")
                          : field.type === "select"
                          ? field.options?.find((o) => o.value === String(activeRow[field.name]))?.label ||
                            String(activeRow[field.name] || "-")
                          : activeRow[field.name] !== undefined && activeRow[field.name] !== null && activeRow[field.name] !== ""
                          ? String(activeRow[field.name])
                          : "-"}
                      </p>
                    </div>
                  ))}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    ID Technique
                  </span>
                  <p className="mt-1 text-sm font-semibold text-slate-800 font-mono">
                    {activeRow.id || "-"}
                  </p>
                </div>
                {activeRow.created_at && (
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Date de création
                    </span>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {String(activeRow.created_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold transition"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  const row = activeRow;
                  handleCloseModal();
                  if (row) handleOpenEdit(row);
                }}
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold shadow-md shadow-purple-700/20 transition flex items-center gap-2"
              >
                <FaEdit />
                <span>Modifier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {deletingRow && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FaTrash />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Supprimer cet élément ?</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Êtes-vous sûr de vouloir supprimer définitivement &quot;<strong className="text-slate-800">{rowTitle(deletingRow)}</strong>&quot; ? Cette action est irréversible.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingRow(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-600/20 transition flex items-center gap-2"
              >
                {deleting ? <FaSyncAlt className="animate-spin" /> : <FaTrash />}
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
