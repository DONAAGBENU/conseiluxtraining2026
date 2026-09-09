// app/centre-de-langues/programmes/page.tsx
// Client component — subscription Supabase realtime : chaque nouveau programme
// ajouté par l'admin apparaît instantanément sur cette page (pas besoin de revalidate).

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguageCenter } from "../../components/LanguageCenterProvider";

interface Programme {
  id: string;
  nom: string;
  duree: string;
  niveau_cible: string;
  inclus: string[];
  prix: string;
  couleur: string;
  ordre?: number;
}

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, t } = useLanguageCenter();

  // Dark mode helpers
  const bgMain = darkMode ? "bg-[#050d1f] text-white" : "bg-white text-[#0a1128]";
  const textMuted = darkMode ? "text-white/60" : "text-[#0a1128]/50";
  const cardBg = darkMode
    ? "bg-[#111c35] border-[#ff6b00]/40"
    : "bg-white border-[#ff6b00]";
  const itemColor = darkMode ? "text-white/70" : "text-[#0a1128]/70";

  // 1. Chargement initial
  useEffect(() => {
    async function fetchProgrammes() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("programmes")
          .select("*")
          .order("ordre");
        if (!error) setProgrammes(data ?? []);
      } catch (e) {
        console.error("Erreur fetch programmes:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProgrammes();
  }, []);

  // 2. Subscription realtime — les ajouts/modifs/suppressions admin arrivent en direct
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("programmes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "programmes" },
        () => {
          // Recharge la liste complète à chaque changement
          supabase!
            .from("programmes")
            .select("*")
            .order("ordre")
            .then(({ data }) => {
              if (data) setProgrammes(data);
            });
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, []);

  const pt = t.programmesPage;

  return (
    <main className={`${bgMain} transition-colors duration-300`}>
      {/* Header section */}
      <section className="bg-[#ff6b00] py-16 text-white">
        <div className="mx-auto max-w-6xl px-6 flex items-center gap-8">
          <div className="flex-1">
            <Link
              href="/centre-de-langues"
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors shrink-0 whitespace-nowrap"
            >
              {pt.back}
            </Link>
            <h1
              className="mt-4 text-3xl md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pt.title}{" "}
              <span className="italic text-white">{pt.titleItalic}</span>
            </h1>
            <p className="mt-4 max-w-xl text-white/90">{pt.subtitle}</p>
          </div>
          <div className="hidden lg:block w-64">
            <div className="relative h-80 w-full">
              <img
                src="/images/formation programme1.jpeg"
                alt="Language learning"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programmes grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-start gap-8">
          <div className="flex-1">
            {loading ? (
              /* Skeleton loader */
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border-2 ${cardBg} p-6 animate-pulse`}
                  >
                    <div className="h-1.5 w-10 rounded-full bg-current opacity-20" />
                    <div className="mt-4 h-5 w-2/3 rounded bg-current opacity-20" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-current opacity-10" />
                    <div className="mt-5 space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-3 rounded bg-current opacity-10" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : programmes.length === 0 ? (
              <p className={`text-sm ${textMuted} py-12 text-center`}>
                {pt.noPrograms}
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {programmes.map((p) => (
                  <div
                    key={p.id}
                    className={`flex flex-col rounded-2xl border-2 ${cardBg} p-6 shadow-sm transition-colors duration-300`}
                  >
                    <span
                      className="h-1.5 w-10 rounded-full"
                      style={{ backgroundColor: p.couleur }}
                    />
                    <h3 className="mt-4 text-lg font-semibold">{p.nom}</h3>
                    <div className={`mt-1 flex items-center gap-3 text-xs ${textMuted}`}>
                      <span>{p.duree}</span>
                      <span>•</span>
                      <span>{p.niveau_cible}</span>
                    </div>
                    <ul className={`mt-5 flex-1 space-y-2 text-sm ${itemColor}`}>
                      {(p.inclus as string[]).map((it) => (
                        <li key={it} className="flex gap-2">
                          <span style={{ color: p.couleur }}>—</span>
                          {it}
                        </li>
                      ))}
                    </ul>
                    <div
                      className={`mt-6 flex items-center justify-between border-t pt-4 ${
                        darkMode ? "border-[#ff6b00]/20" : "border-[#ff6b00]/10"
                      }`}
                    >
                      <span className="text-sm font-semibold">{p.prix}</span>
                      <Link
                        href="/contact"
                        className="rounded-lg bg-[#ff6b00] px-4 py-2 text-xs font-semibold text-white hover:bg-[#ff5500] transition-colors"
                      >
                        {pt.requestQuote}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block w-72">
            <div className="relative h-96 w-full">
              <img
                src="/images/programe formation2.jpeg"
                alt="Language programs"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}