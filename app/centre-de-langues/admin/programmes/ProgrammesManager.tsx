// app/centre-de-langues/admin/programmes/ProgrammesManager.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import AdminHeader from "@/app/components/AdminLanguageHeader";
import { useLanguageCenter } from "@/app/components/LanguageCenterProvider";

export type Programme = {
  id: string;
  nom: string;
  duree: string;
  niveau_cible: string;
  inclus: string[];
  prix: string;
  couleur: string;
  ordre: number;
};

const VIDE: Omit<Programme, "id"> = {
  nom: "",
  duree: "",
  niveau_cible: "",
  inclus: [],
  prix: "À définir",
  couleur: "#f97316",
  ordre: 0,
};

// Traductions pour le gestionnaire de programmes
const pmT = {
  fr: {
    title: "Programmes — Centre de Langues",
    addTitle: "Ajouter un programme",
    editTitle: "Modifier le programme",
    namePh: "Nom (ex: English Master)",
    dureePh: "Durée (ex: 9 mois)",
    niveauPh: "Niveau cible (ex: A2/B1 → B2)",
    prixPh: "Prix (ex: 250 000 FCFA ou À définir)",
    ordrePh: "Ordre d'affichage",
    inclusPh: "Ce qui est inclus, une ligne par élément\nEx: Test de positionnement\nBusiness English",
    save: "Enregistrement...",
    add: "Ajouter",
    update: "Mettre à jour",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    confirmDelete: "Supprimer ce programme ?",
    noPrograms: "Aucun programme enregistré.",
  },
  en: {
    title: "Programs — Language Center",
    addTitle: "Add a program",
    editTitle: "Edit program",
    namePh: "Name (e.g. English Master)",
    dureePh: "Duration (e.g. 9 months)",
    niveauPh: "Target level (e.g. A2/B1 → B2)",
    prixPh: "Price (e.g. 250,000 FCFA or TBD)",
    ordrePh: "Display order",
    inclusPh: "What is included, one item per line\nEx: Placement test\nBusiness English",
    save: "Saving...",
    add: "Add",
    update: "Update",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Delete this program?",
    noPrograms: "No programs registered yet.",
  },
} as const;

export default function ProgrammesManager({ initial }: { initial: Programme[] }) {
  const [programmes, setProgrammes] = useState(initial);
  const [form, setForm] = useState<Omit<Programme, "id"> | Programme>(VIDE);
  const [inclusText, setInclusText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const { darkMode, language } = useLanguageCenter();
  const pt = pmT[language];

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setAuthenticated(data.authenticated || false);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Redirect (never during render)
  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/centre-de-langues/admin/login");
    }
  }, [loading, authenticated, router]);

  const isEditing = "id" in form;

  function startEdit(p: Programme) {
    setForm(p);
    setInclusText(p.inclus.join("\n"));
  }

  function resetForm() {
    setForm(VIDE);
    setInclusText("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      inclus: inclusText.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (!supabase) throw new Error("Supabase non configuré");

      if (isEditing) {
        const { id, ...rest } = payload as Programme;
        const { error } = await supabase.from("programmes").update(rest).eq("id", id);
        if (!error) {
          setProgrammes((prev) => prev.map((p) => (p.id === id ? { ...p, ...rest } : p)));
        }
      } else {
        const { data, error } = await supabase
          .from("programmes")
          .insert(payload)
          .select()
          .single();
        if (!error && data) {
          setProgrammes((prev) => [...prev, data as Programme]);
        }
      }
      resetForm();
      router.refresh();
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(pt.confirmDelete)) return;
    try {
      if (!supabase) throw new Error("Supabase non configuré");
      const { error } = await supabase.from("programmes").delete().eq("id", id);
      if (!error) {
        setProgrammes((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error("Erreur suppression:", e);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/centre-de-langues/admin/login");
  }

  // Dark mode helpers
  const bg = darkMode ? "bg-[#050d1f] text-white" : "bg-white text-[#0a1128]";
  const inputCls = darkMode
    ? "rounded-lg border-2 border-[#ff6b00]/60 px-3 py-2 text-sm bg-[#111c35] text-white placeholder-white/40 focus:border-[#ff6b00] outline-none"
    : "rounded-lg border-2 border-[#ff6b00] px-3 py-2 text-sm bg-white text-gray-800 focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff6b00]/20 outline-none";
  const formBg = darkMode
    ? "rounded-2xl border-2 border-[#ff6b00]/40 bg-[#111c35] p-6 shadow-lg"
    : "rounded-2xl border-2 border-[#ff6b00] bg-white p-6 shadow-lg";
  const cardCls = darkMode
    ? "flex items-center justify-between rounded-xl border border-[#ff6b00]/40 bg-[#111c35] px-5 py-4 hover:border-[#ff6b00] transition-colors"
    : "flex items-center justify-between rounded-xl border border-[#ff6b00] bg-white px-5 py-4 hover:border-[#ff5500] transition-colors";

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-[#050d1f]" : "bg-white"}`}>
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00]" />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg}`}>
      <AdminHeader onLogout={handleLogout} />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-xl font-semibold">{pt.title}</h1>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className={`mt-8 ${formBg}`}>
          <h2 className="text-sm font-semibold text-[#ff6b00]">
            {isEditing ? pt.editTitle : pt.addTitle}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              placeholder={pt.namePh}
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
              className={inputCls}
            />
            <input
              placeholder={pt.dureePh}
              value={form.duree}
              onChange={(e) => setForm({ ...form, duree: e.target.value })}
              required
              className={inputCls}
            />
            <input
              placeholder={pt.niveauPh}
              value={form.niveau_cible}
              onChange={(e) => setForm({ ...form, niveau_cible: e.target.value })}
              required
              className={inputCls}
            />
            <input
              placeholder={pt.prixPh}
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              className={inputCls}
            />
            <input
              type="color"
              value={form.couleur}
              onChange={(e) => setForm({ ...form, couleur: e.target.value })}
              className="h-10 w-16 rounded-lg border-2 border-[#ff6b00]"
            />
            <input
              type="number"
              placeholder={pt.ordrePh}
              value={form.ordre}
              onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
          <textarea
            placeholder={pt.inclusPh}
            value={inclusText}
            onChange={(e) => setInclusText(e.target.value)}
            rows={4}
            className={`mt-4 w-full ${inputCls}`}
          />
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#ff6b00] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[#ff5500] transition-colors"
            >
              {saving ? pt.save : isEditing ? pt.update : pt.add}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-[#ff6b00] hover:text-[#ff5500]"
              >
                {pt.cancel}
              </button>
            )}
          </div>
        </form>

        {/* Liste */}
        <div className="mt-8 space-y-3">
          {programmes.length === 0 && (
            <p className={`text-sm py-4 ${darkMode ? "text-white/50" : "text-[#0a1128]/50"}`}>
              {pt.noPrograms}
            </p>
          )}
          {programmes
            .sort((a, b) => a.ordre - b.ordre)
            .map((p) => (
              <div key={p.id} className={cardCls}>
                <div>
                  <p className="text-sm font-semibold">{p.nom}</p>
                  <p className={`text-xs ${darkMode ? "text-white/50" : "text-[#0a1128]/50"}`}>
                    {p.duree} · {p.niveau_cible} · {p.prix}
                  </p>
                </div>
                <div className="flex gap-3 text-xs">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-[#ff6b00] hover:text-[#ff5500] hover:underline"
                  >
                    {pt.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-400 hover:underline"
                  >
                    {pt.delete}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}