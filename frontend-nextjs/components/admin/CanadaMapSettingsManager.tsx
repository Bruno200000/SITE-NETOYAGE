"use client";

import { useEffect, useState } from "react";
import { FaSave, FaCheckCircle, FaMapMarkedAlt, FaUndo, FaEye, FaSpinner, FaShieldAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { api, getList, invalidateList } from "@/services/api";
import { CanadaInteractiveMap, CANADA_PROVINCES } from "@/components/public/CanadaInteractiveMap";

interface SettingItem {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
}

export function CanadaMapSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsMap, setSettingsMap] = useState<Record<string, { id?: number; value: string }>>({});

  // Form states
  const [title, setTitle] = useState("Couverture & Interventions au Canada");
  const [subtitle, setSubtitle] = useState("Présence active au Nouveau-Brunswick et interventions sur demande");
  const [activeProvinces, setActiveProvinces] = useState<string[]>(["NB", "QC", "ON", "NS", "PE"]);
  const [mainRegion, setMainRegion] = useState("Nouveau-Brunswick (Moncton & environs)");
  const [badge, setBadge] = useState("Intervention 7j/7");
  const [note, setNote] = useState("Des équipes professionnelles mobiles pour projets résidentiels, commerciaux et après travaux.");
  const [accentColor, setAccentColor] = useState("#ff7a1a");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const list = await getList<SettingItem>("settings", true);
      const map: Record<string, { id?: number; value: string }> = {};

      list.forEach((item) => {
        map[item.setting_key] = { id: item.id, value: item.setting_value };
      });
      setSettingsMap(map);

      if (map.canada_map_title) setTitle(map.canada_map_title.value);
      if (map.canada_map_subtitle) setSubtitle(map.canada_map_subtitle.value);
      if (map.canada_map_provinces) {
        setActiveProvinces(
          map.canada_map_provinces.value
            .split(",")
            .map((c) => c.trim().toUpperCase())
            .filter(Boolean)
        );
      }
      if (map.canada_map_main_region) setMainRegion(map.canada_map_main_region.value);
      if (map.canada_map_badge) setBadge(map.canada_map_badge.value);
      if (map.canada_map_note) setNote(map.canada_map_note.value);
      if (map.canada_map_color) setAccentColor(map.canada_map_color.value);
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  }

  function toggleProvince(code: string) {
    setActiveProvinces((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  function applyPreset(codes: string[]) {
    setActiveProvinces(codes);
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);

    const keysToSave = [
      { key: "canada_map_title", val: title, type: "text" },
      { key: "canada_map_subtitle", val: subtitle, type: "text" },
      { key: "canada_map_provinces", val: activeProvinces.join(","), type: "text" },
      { key: "canada_map_main_region", val: mainRegion, type: "text" },
      { key: "canada_map_badge", val: badge, type: "text" },
      { key: "canada_map_note", val: note, type: "text" },
      { key: "canada_map_color", val: accentColor, type: "color" }
    ];

    try {
      for (const item of keysToSave) {
        const existing = settingsMap[item.key];
        if (existing && existing.id) {
          await api.put(`/settings/${existing.id}`, {
            setting_key: item.key,
            setting_value: item.val,
            setting_type: item.type
          });
        } else {
          await api.post("/settings", {
            setting_key: item.key,
            setting_value: item.val,
            setting_type: item.type
          });
        }
      }

      invalidateList("settings");
      await loadSettings();

      Swal.fire({
        icon: "success",
        title: "Carte du Canada mise à jour !",
        text: "Les modifications sont immédiatement visibles sur la page de contact du site.",
        confirmButtonColor: "#0b63ce"
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: msg,
        confirmButtonColor: "#0b63ce"
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <FaSpinner className="animate-spin text-4xl text-brand-blue mb-4" />
        <p className="font-bold">Chargement des paramètres de la carte...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand-blue text-2xl">
            <FaMapMarkedAlt />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Personnalisation de la Carte du Canada</h1>
            <p className="text-sm text-slate-500">
              Modifiez les zones couvertes, le titre, le badge et le point d&apos;ancrage affichés sur la page contact.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 font-black text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {saving ? "Enregistrement..." : "Enregistrer la carte"}
        </button>
      </div>

      {/* Grid: Editor form (left) + Live preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSave} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 space-y-5">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FaShieldAlt className="text-brand-blue" /> Informations &amp; Textes de la carte
            </h2>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                Titre principal de la carte
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-brand-blue focus:outline-none"
                placeholder="ex: Couverture & Interventions au Canada"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                Sous-titre / Message d&apos;accompagnement
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-blue focus:outline-none"
                placeholder="ex: Présence active au Nouveau-Brunswick et interventions sur demande"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                  Badge d&apos;intervention
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-brand-blue focus:outline-none"
                  placeholder="ex: Intervention 7j/7"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                  Couleur d&apos;accentuation
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-14 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold uppercase text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                Région / Ville de la base principale (Repère animé)
              </label>
              <input
                type="text"
                value={mainRegion}
                onChange={(e) => setMainRegion(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-brand-blue focus:outline-none"
                placeholder="ex: Nouveau-Brunswick (Moncton & environs)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                Note informative (bas de carte)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-brand-blue focus:outline-none"
                placeholder="Note affichée en bas de carte..."
              />
            </div>

            {/* Province selector */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Provinces &amp; Territoires couverts ({activeProvinces.length} sélectionnés)
                </label>
              </div>

              {/* Presets buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => applyPreset(["NB", "NS", "PE", "NL"])}
                  className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-brand-blue hover:bg-blue-100 transition"
                >
                  Maritimes
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(["NB", "QC", "ON", "NS", "PE"])}
                  className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-brand-blue hover:bg-blue-100 transition"
                >
                  Est du Canada (Recommandé)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(CANADA_PROVINCES.map((p) => p.code))}
                  className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-brand-blue hover:bg-blue-100 transition"
                >
                  Tout le Canada
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(["NB"])}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  NB uniquement
                </button>
              </div>

              {/* Province check chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto p-1">
                {CANADA_PROVINCES.map((prov) => {
                  const isChecked = activeProvinces.includes(prov.code);
                  return (
                    <button
                      key={prov.code}
                      type="button"
                      onClick={() => toggleProvince(prov.code)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                        isChecked
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="truncate mr-1">
                        <span className="font-mono mr-1.5 opacity-80">{prov.code}</span>
                        <span>{prov.shortName}</span>
                      </div>
                      {isChecked ? (
                        <FaCheckCircle className="shrink-0 text-white text-xs" />
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 font-black text-white shadow-md hover:bg-orange-600 transition disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {saving ? "Sauvegarde en cours..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <FaEye className="text-brand-blue" /> Aperçu direct (tel qu&apos;affiché sur la page contact)
            </span>
            <span className="text-xs font-bold text-slate-400">Interactif en temps réel</span>
          </div>

          <div className="sticky top-28">
            <CanadaInteractiveMap
              overrideTitle={title}
              overrideSubtitle={subtitle}
              overrideProvinces={activeProvinces.join(",")}
              overrideMainPin={mainRegion}
              overrideBadge={badge}
              overrideNote={note}
              overrideColor={accentColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
