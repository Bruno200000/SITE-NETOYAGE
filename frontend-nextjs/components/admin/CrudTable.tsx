"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaEye, FaPlus, FaSyncAlt, FaTrash } from "react-icons/fa";
import { api, getList, invalidateList } from "@/services/api";

type Row = Record<string, string | number | undefined | null>;

export type CrudField = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "number" | "date" | "time" | "textarea" | "select" | "url" | "password" | "image";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
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
  published: "Publie",
  draft: "Brouillon",
  scheduled: "Planifie",
  confirmed: "Confirme",
  completed: "Termine",
  processed: "Traite",
  cancelled: "Annule",
  archived: "Archive",
  new: "Nouveau"
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost/SITE%20NETOYAGE/api";

function mediaUrl(value: unknown): string {
  const path = String(value || "");
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/") || path.startsWith("data:")) return path;
  return `${apiBase.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
}

function rowTitle(row: Row): string {
  return String(row.title || row.name || row.client_name || row.email || row.setting_key || row.question || `Element #${row.id || ""}`);
}

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function escapeAttr(value: unknown): string {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function displayValue(row: Row, field: CrudField): string {
  const value = row[field.name];
  if (value === undefined || value === null || value === "") return "-";
  if (field.name === "status") return statusLabels[String(value)] || String(value);
  if (field.type === "select") return field.options?.find((option) => option.value === String(value))?.label || String(value);
  return String(value);
}

function detailHtml(fields: CrudField[], row: Row, title: string): string {
  const imageFields = fields.filter((field) => field.type === "image" && row[field.name]);
  const detailFields = fields.filter((field) => field.type !== "password");
  return `
    <div class="admin-detail-head">
      <h3>${escapeHtml(rowTitle(row))}</h3>
      <p>Detail complet - ${escapeHtml(title)}</p>
    </div>
    ${imageFields.length ? `
      <div class="admin-detail-images">
        ${imageFields.map((field) => `
          <figure>
            <img src="${escapeAttr(mediaUrl(row[field.name]))}" alt="">
            <figcaption>${escapeHtml(field.label)}</figcaption>
          </figure>
        `).join("")}
      </div>
    ` : ""}
    <div class="admin-detail-grid">
      ${detailFields.map((field) => `
        <div class="admin-detail-item ${field.type === "textarea" ? "is-wide" : ""}">
          <span>${escapeHtml(field.label)}</span>
          <strong>${escapeHtml(displayValue(row, field))}</strong>
        </div>
      `).join("")}
      <div class="admin-detail-item">
        <span>ID</span>
        <strong>${escapeHtml(row.id || "-")}</strong>
      </div>
      ${row.created_at ? `
        <div class="admin-detail-item">
          <span>Date de creation</span>
          <strong>${escapeHtml(row.created_at)}</strong>
        </div>
      ` : ""}
    </div>
  `;
}

function fieldHtml(field: CrudField, value: unknown = ""): string {
  const required = field.required ? "data-required='true'" : "";
  const inputType = field.type === "image" ? "url" : field.type || "text";
  const placeholder = field.placeholder || (field.type === "image" ? "https://... ou /uploads/image.jpg" : field.label);
  const common = `id="crud-${field.name}" ${required} class="admin-form-control" placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(value)}"`;
  if (field.type === "textarea") {
    return `<textarea id="crud-${field.name}" ${required} class="admin-form-control admin-form-textarea" placeholder="${escapeAttr(placeholder)}">${escapeAttr(value)}</textarea>`;
  }
  if (field.type === "select") {
    return `<select id="crud-${field.name}" ${required} class="admin-form-control">${(field.options || []).map((option) => `<option value="${escapeAttr(option.value)}" ${String(value) === option.value ? "selected" : ""}>${escapeAttr(option.label)}</option>`).join("")}</select>`;
  }
  if (field.type === "image") {
    const preview = mediaUrl(value);
    return `
      <div class="admin-photo-upload">
        <label class="admin-photo-picker" for="crud-file-${field.name}">
          <span class="admin-photo-preview ${preview ? "has-image" : ""}" data-preview-for="${escapeAttr(field.name)}">
            ${preview ? `<img src="${escapeAttr(preview)}" alt="">` : `<span class="admin-photo-icon">PHOTO</span>`}
          </span>
          <span class="admin-photo-action">Importer une image</span>
          <input id="crud-file-${field.name}" data-image-field="${escapeAttr(field.name)}" class="admin-photo-input" type="file" accept="image/png,image/jpeg,image/webp">
        </label>
        <div class="admin-image-path">
          <span>Ou coller une URL</span>
          <input type="${inputType}" ${common}>
        </div>
      </div>
    `;
  }
  return `<input type="${inputType}" ${common}>`;
}

function modalFormHtml(fields: CrudField[], title: string, row?: Row): string {
  return `
    <div class="admin-form-head">
      <h3>${row ? `Modifier ${escapeAttr(rowTitle(row))}` : `Ajouter - ${escapeAttr(title)}`}</h3>
      <p>${row ? "Mettez a jour les informations necessaires." : "Remplissez les informations pour creer un nouvel element."}</p>
    </div>
    <div class="admin-modal-form">
      ${fields.map((field) => `
        <label class="admin-form-field ${field.type === "textarea" || field.type === "image" ? "admin-form-field-wide" : ""}">
          <span class="admin-form-label">${escapeAttr(field.label)}${field.required ? " <strong>*</strong>" : ""}</span>
          ${fieldHtml(field, row?.[field.name])}
        </label>
      `).join("")}
    </div>
  `;
}

async function uploadImage(field: CrudField): Promise<string> {
  const fileInput = document.getElementById(`crud-file-${field.name}`) as HTMLInputElement | null;
  const file = fileInput?.files?.[0];
  if (!file) return "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", field.name || "media");

  const response = await api.post<unknown, { data: { path: string } }>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data.path;
}

function bindImagePreviews(fields: CrudField[]) {
  fields.filter((field) => field.type === "image").forEach((field) => {
    const fileInput = document.getElementById(`crud-file-${field.name}`) as HTMLInputElement | null;
    const preview = document.querySelector<HTMLElement>(`[data-preview-for="${field.name}"]`);
    if (!fileInput || !preview) return;

    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      preview.classList.add("has-image");
      preview.innerHTML = `<img src="${url}" alt="">`;
    });
  });
}

async function readForm(fields: CrudField[]): Promise<Row | false> {
  const payload: Row = {};
  for (const field of fields) {
    const input = document.getElementById(`crud-${field.name}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    const value = input?.value?.trim() || "";
    const uploaded = field.type === "image" ? await uploadImage(field) : "";
    const finalValue = uploaded || value;
    if (field.required && !finalValue) {
      Swal.showValidationMessage(`${field.label} est requis.`);
      return false;
    }
    if (finalValue !== "") payload[field.name] = field.type === "number" ? Number(finalValue) : finalValue;
  }
  if (!payload.slug) {
    const slugSource = typeof payload.title === "string" ? payload.title : typeof payload.name === "string" ? payload.name : "";
    if (slugSource) payload.slug = slugify(slugSource);
  }
  return payload;
}

export function CrudTable({ title, rows = [], resource, description, fields = defaultFields }: CrudTableProps) {
  const [items, setItems] = useState<Row[]>(rows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);

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

  async function openCreate() {
    const result = await Swal.fire<Row | false>({
      html: modalFormHtml(fields, title),
      confirmButtonText: "Ajouter",
      showCancelButton: false,
      showCloseButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      confirmButtonColor: "#0b3a8f",
      cancelButtonColor: "#64748b",
      width: 720,
      customClass: {
        popup: "admin-swal-popup",
        title: "admin-swal-title",
        htmlContainer: "admin-swal-html",
        confirmButton: "admin-swal-confirm",
        cancelButton: "admin-swal-cancel"
      },
      didOpen: () => bindImagePreviews(fields),
      preConfirm: () => readForm(fields)
    });

    if (!result.isConfirmed || !result.value) return;
    try {
      let created: Row = { id: Date.now(), ...result.value };
      if (resource) {
        created = await api.post<unknown, Row>(`/${resource}`, result.value);
        invalidateList(resource);
      }
      setItems((current) => [created.id ? created : { id: Date.now(), ...result.value }, ...current]);
      await loadItems(true);
      Swal.fire({ icon: "success", title: "Element ajoute", confirmButtonColor: "#0b3a8f" });
    } catch {
      Swal.fire({ icon: "error", title: "Creation impossible", text: "Verifiez les champs requis et votre connexion API.", confirmButtonColor: "#0b3a8f" });
    }
  }

  async function openView(row: Row) {
    await Swal.fire({
      html: detailHtml(fields, row, title),
      showCloseButton: true,
      confirmButtonText: "Fermer",
      confirmButtonColor: "#0b3a8f",
      width: 780,
      customClass: {
        popup: "admin-swal-popup admin-detail-popup",
        htmlContainer: "admin-swal-html",
        confirmButton: "admin-swal-confirm"
      }
    });
  }

  async function openEdit(row: Row) {
    const result = await Swal.fire<Row | false>({
      html: modalFormHtml(fields, title, row),
      confirmButtonText: "Enregistrer",
      showCancelButton: false,
      showCloseButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      confirmButtonColor: "#0b3a8f",
      cancelButtonColor: "#64748b",
      width: 720,
      customClass: {
        popup: "admin-swal-popup",
        title: "admin-swal-title",
        htmlContainer: "admin-swal-html",
        confirmButton: "admin-swal-confirm",
        cancelButton: "admin-swal-cancel"
      },
      didOpen: () => bindImagePreviews(fields),
      preConfirm: () => readForm(fields)
    });

    if (!result.isConfirmed || !result.value) return;
    try {
      if (resource && row.id) {
        await api.put(`/${resource}/${row.id}`, result.value);
        invalidateList(resource);
      }
      setItems((current) => current.map((item) => item === row ? { ...item, ...(result.value as Row) } : item));
      await loadItems(true);
      Swal.fire({ icon: "success", title: "Modification enregistree", confirmButtonColor: "#0b3a8f" });
    } catch {
      Swal.fire({ icon: "error", title: "Modification impossible", confirmButtonColor: "#0b3a8f" });
    }
  }

  async function confirmDelete(row: Row) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Supprimer cet element ?",
      text: rowTitle(row),
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626"
    });

    if (!result.isConfirmed) return;

    try {
      if (resource && row.id) {
        await api.delete(`/${resource}/${row.id}`);
        invalidateList(resource);
      }
      setItems((current) => current.filter((item) => item !== row));
      Swal.fire({ icon: "success", title: "Element supprime", confirmButtonColor: "#0b3a8f" });
    } catch {
      Swal.fire({ icon: "error", title: "Suppression impossible", confirmButtonColor: "#0b3a8f" });
    }
  }

  return (
    <section className="admin-panel overflow-hidden">
      <div className="admin-panel-head flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="admin-kicker">Module admin</span>
          <h1 className="mt-1 text-2xl font-black text-slate-950">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description || "Recherche, filtre et actions rapides."}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={() => loadItems(true)} className="admin-btn admin-btn-ghost">
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Actualiser
          </button>
          <button type="button" onClick={openCreate} className="admin-btn admin-btn-primary"><FaPlus /> Ajouter</button>
        </div>
      </div>
      <div className="admin-filters grid gap-3 md:grid-cols-[1fr_190px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-filter-control" placeholder="Recherche instantanee" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-filter-control">
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="pending">En attente</option>
          <option value="published">Publie</option>
          <option value="draft">Brouillon</option>
          <option value="scheduled">Planifie</option>
          <option value="confirmed">Confirme</option>
          <option value="completed">Termine</option>
          <option value="processed">Traite</option>
          <option value="cancelled">Annule</option>
          <option value="archived">Archive</option>
          <option value="new">Nouveau</option>
        </select>
      </div>
      <div className="admin-table-wrap overflow-x-auto">
        <table className="admin-table w-full min-w-[1040px] text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              {[...listFields.map((field) => field.label), "ID", "Actions"].map((h) => <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => (
              <tr key={`${row.id || index}-${rowTitle(row)}`} className="transition">
                {listFields.map((field) => (
                  <td key={field.name} className="max-w-[260px] px-4 py-4 text-slate-700">
                    {field.type === "image" && row[field.name] ? (
                      <img src={mediaUrl(row[field.name])} alt="" className="h-12 w-16 rounded-md object-cover ring-1 ring-slate-100" />
                    ) : field.name === "status" ? (
                      <span className="admin-status-pill">{displayValue(row, field)}</span>
                    ) : (
                      <span className={`${field.name === "title" || field.name === "name" || field.name === "client_name" ? "font-bold text-slate-900" : ""} line-clamp-2`}>{displayValue(row, field)}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-4 text-slate-500">{row.id || "-"}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openView(row)} className="admin-icon-btn" aria-label="Voir"><FaEye /></button>
                    <button type="button" onClick={() => openEdit(row)} className="admin-icon-btn" aria-label="Modifier"><FaEdit /></button>
                    <button type="button" onClick={() => confirmDelete(row)} className="admin-icon-btn admin-icon-btn-danger" aria-label="Supprimer"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length ? (
              <tr><td colSpan={listFields.length + 2} className="px-4 py-10 text-center text-slate-500">Aucun element trouve.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
