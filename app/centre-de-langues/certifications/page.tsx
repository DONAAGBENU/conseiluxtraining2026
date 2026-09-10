// app/centre-de-langues/certifications/page.tsx
// Conseilux Language Academy — Centre d'examen & Séjours linguistiques
// Suite du cahier de charge : points 11 (parcours TOEIC), 12 (centre d'examen),
// 13 (système de progression), 8bis (séjours linguistiques / immersion)

"use client";

import Link from "next/link";
import { useLanguageCenter } from "../../components/LanguageCenterProvider";

export default function CertificationsPage() {
  const { darkMode, t } = useLanguageCenter();

  // Dark mode helpers
  const bgMain = darkMode ? "bg-[#050d1f] text-white" : "bg-white text-[#0a1128]";
  const textMuted = darkMode ? "text-white/60" : "text-[#0a1128]/60";
  const cardBg = darkMode
    ? "bg-[#111c35] border-[#ff6b00]/40"
    : "bg-white border-[#ff6b00]";
  const itemColor = darkMode ? "text-white/70" : "text-[#0a1128]/70";

  const pt = t.certificationsPage;

  return (
    <main className={`${bgMain} transition-colors duration-300`}>
      {/* ---------- HEADER ---------- */}
      <section className="bg-[#ff6b00] py-16 text-white relative overflow-hidden">
        {/* subtle background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative mx-auto max-w-6xl px-6">
          {/* Top row: back link + luxury button pushed to far right */}
          <div className="flex items-center justify-between">
            <Link
              href="/centre-de-langues"
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors shrink-0 whitespace-nowrap"
            >
              {t.programmesPage.back}
            </Link>

            {/* ✨ Luxury "Test de Niveau" button — top-right corner */}
            <Link
              href="/centre-de-langues/test-de-niveau"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md px-5 py-3 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
            >
              {/* shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {/* pulsing green dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>

              <span className="relative tracking-wide uppercase text-xs font-extrabold">{pt.testLevelButton}</span>

              {/* arrow icon */}
              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Title + subtitle below */}
          <div className="mt-6">
            <h1
              className="text-3xl md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pt.title}
            </h1>
            <p className="mt-4 max-w-xl text-white/90">
              {pt.subtitle}
            </p>
          </div>
        </div>
      </section>


      {/* ---------- EXAMENS PRÉPARÉS ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {pt.examCenterTitle}
            </h2>
            <p className={`mt-2 max-w-2xl text-sm ${textMuted}`}>
              {pt.examCenterSubtitle}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {pt.examens.map((e: any) => (
                <div key={e.code} className={`rounded-xl border-2 border-[#ff6b00] p-5 ${cardBg}`}>
                  <span className="text-lg font-semibold text-[#ff6b00]">{e.code}</span>
                  <p className={`mt-2 text-sm ${textMuted}`}>{e.desc}</p>
                </div>
              ))}
            </div>
            <p className={`mt-4 text-xs ${darkMode ? "text-white/40" : "text-[#0a1128]/40"}`}>
              {pt.examNote}
            </p>
          </div>
          <div className="hidden lg:block w-72">
            <div className="relative h-96 w-full">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=500&fit=crop"
                alt="English certifications"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PIPELINE ---------- */}
      <section className="bg-[#ff6b00] py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {pt.pipelineTitle}
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {pt.pipeline.map((step: string, i: number) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm">
                  {step}
                </span>
                {i < pt.pipeline.length - 1 && <span className="text-white">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- GRILLE DE PROGRESSION ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          {pt.progressionTitle}
        </h2>
        <div className="mt-8 overflow-hidden rounded-2xl border-2 border-[#ff6b00]">
          <table className="w-full text-sm">
            <thead className="bg-[#ff6b00] text-white">
              <tr>
                <th className="px-5 py-3 text-left font-medium">{pt.tableNiveau}</th>
                <th className="px-5 py-3 text-left font-medium">{pt.tableDuree}</th>
                <th className="px-5 py-3 text-left font-medium">{pt.tableValidation}</th>
              </tr>
            </thead>
            <tbody>
              {pt.progression.map((row: any, i: number) => (
                <tr key={row.niveau} className={i % 2 === 0 ? (darkMode ? "bg-[#111c35]" : "bg-white") : (darkMode ? "bg-[#1a2a4a]" : "bg-orange-50")}>
                  <td className={`px-5 py-3 font-semibold ${darkMode ? "text-white" : "text-[#0a1128]"}`}>{row.niveau}</td>
                  <td className={`px-5 py-3 ${textMuted}`}>{row.duree}</td>
                  <td className={`px-5 py-3 ${textMuted}`}>{row.validation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- SÉJOURS LINGUISTIQUES ---------- */}
      <section className={`${darkMode ? "bg-[#050d1f]" : "bg-white"} py-16`}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f97316]">
            {pt.sejourPremium}
          </p>
          <h2
            className={`mt-2 text-2xl md:text-3xl ${darkMode ? "text-white" : "text-[#0a1128]"}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {pt.sejourTitle}
          </h2>
          <p className={`mt-3 max-w-2xl text-sm ${textMuted}`}>
            {pt.sejourSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {pt.destinations.map((d: any) => (
              <span
                key={d.pays}
                className={`flex items-center gap-2 rounded-full border border-[#f97316]/10 px-4 py-2 text-sm ${darkMode ? "bg-[#111c35]" : "bg-white"} ${itemColor}`}
              >
                <span>{d.flag}</span>
                {d.pays}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pt.formules.map((f: any) => (
              <div key={f.nom} className={`rounded-xl border border-[#f97316]/10 p-5 ${darkMode ? "bg-[#111c35]" : "bg-white"}`}>
                <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-[#0a1128]"}`}>{f.nom}</h3>
                <p className={`mt-2 text-xs ${textMuted}`}>{f.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="mt-10 inline-block rounded-lg bg-[#f97316] px-6 py-3 text-sm font-semibold text-white"
          >
            {pt.contactButton}
          </Link>
        </div>
      </section>
    </main>
  );
}