// app/centre-de-langues/inscription/page.tsx
// Conseilux Language Academy — Inscription, Règlement intérieur, Évaluation, Attestation
// Suite du cahier de charge : points 6 (règlement intérieur), 8 (processus d'inscription),
// 9 (système d'évaluation et de notation), 10 (modèle d'attestation)

"use client";

import Link from "next/link";
import { useLanguageCenter } from "../../components/LanguageCenterProvider";

export default function InscriptionPage() {
  const { darkMode, t } = useLanguageCenter();

  // Dark mode helpers
  const bgMain = darkMode ? "bg-[#050d1f] text-white" : "bg-white text-[#0a1128]";
  const textMuted = darkMode ? "text-white/60" : "text-[#0a1128]/60";
  const cardBg = darkMode
    ? "bg-[#111c35] border-[#ff6b00]/40"
    : "bg-white border-[#ff6b00]";
  const itemColor = darkMode ? "text-white/70" : "text-[#0a1128]/70";

  const pt = t.inscriptionPage;

  return (
    <main className={`${bgMain} transition-colors duration-300`}>
      {/* ---------- HEADER DE SECTION ---------- */}
      <section className="bg-[#ff6b00] py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Link 
            href="/centre-de-langues" 
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors shrink-0 whitespace-nowrap"
          >
            {t.programmesPage.back}
          </Link>
          <h1
            className="mt-4 text-3xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {pt.title}
          </h1>
          <p className="mt-4 max-w-xl text-white/90">
            {pt.subtitle}
          </p>
        </div>
      </section>

      {/* ---------- DOCUMENTS REQUIS ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {pt.documentsTitle}
            </h2>
            <p className={`mt-2 max-w-2xl text-sm ${textMuted}`}>
              {pt.documentsSubtitle}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {pt.documents.map((d: string) => (
                <div
                  key={d}
                  className={`flex items-center gap-3 rounded-xl border-2 border-[#ff6b00] px-4 py-3 text-sm ${cardBg} ${itemColor}`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6b00]" />
                  {d}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-64">
            <div className="relative h-80 w-full">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop"
                alt="Registration documents"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- RÈGLEMENT INTÉRIEUR ---------- */}
      <section className={`${darkMode ? "bg-[#050d1f]" : "bg-white"} py-16`}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {pt.reglementTitle}
          </h2>
          <p className={`mt-2 max-w-2xl text-sm ${textMuted}`}>
            {pt.reglementSubtitle}
          </p>
          <div className="mt-8 divide-y divide-[#ff6b00]/10 rounded-2xl border-2 border-[#ff6b00]">
            {pt.reglement.map((r: any) => (
              <div key={r.title} className="grid gap-1 p-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-[#0a1128]"}`}>{r.title}</span>
                <span className={`text-sm ${textMuted}`}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SYSTÈME D'ÉVALUATION ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          {pt.evaluationTitle}
        </h2>
        <p className={`mt-2 max-w-2xl text-sm ${textMuted}`}>
          {pt.evaluationSubtitle}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Barème */}
          <div className={`overflow-hidden rounded-2xl border border-[#f97316]/10 ${darkMode ? "bg-[#111c35]" : "bg-white"}`}>
            {pt.bareme.map((b: any, i: number) => (
              <div
                key={b.plage}
                className={`flex items-center justify-between px-5 py-4 text-sm ${
                  i % 2 === 0 ? (darkMode ? "bg-[#111c35]" : "bg-white") : (darkMode ? "bg-[#1a2a4a]" : "bg-orange-50")
                }`}
              >
                <span className={`font-semibold ${darkMode ? "text-white" : "text-[#0a1128]"}`}>{b.plage}</span>
                <span className={`${textMuted}`}>{b.mention}</span>
              </div>
            ))}
          </div>

          {/* Relevé de progression */}
          <div className="rounded-2xl bg-[#f97316] p-6 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              {pt.progressDossier}
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              {pt.progressTitle}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {pt.progressItems.map((item: string) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-white/70">
              {pt.progressNote}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- ATTESTATION ---------- */}
      <section className={`${darkMode ? "bg-[#050d1f]" : "bg-white"} py-16`}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {pt.attestationTitle}
          </h2>
          <p className={`mt-2 max-w-2xl text-sm ${textMuted}`}>
            {pt.attestationSubtitle}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className={`rounded-2xl border-2 border-[#f97316]/40 p-6 ${darkMode ? "bg-[#111c35]" : "bg-white"}`}>
              <span className="text-xs font-semibold text-[#f97316]">01</span>
              <h3 className={`mt-2 text-base font-semibold ${darkMode ? "text-white" : "text-[#0a1128]"}`}>
                {pt.attestation1Title}
              </h3>
              <p className={`mt-2 text-sm ${textMuted}`}>
                {pt.attestation1Desc}
              </p>
            </div>
            <div className={`rounded-2xl border-2 border-[#f97316]/10 p-6 ${darkMode ? "bg-[#111c35]" : "bg-white"}`}>
              <span className="text-xs font-semibold text-[#f97316]">02</span>
              <h3 className={`mt-2 text-base font-semibold ${darkMode ? "text-white" : "text-[#0a1128]"}`}>
                {pt.attestation2Title}
              </h3>
              <p className={`mt-2 text-sm ${textMuted}`}>
                {pt.attestation2Desc}
              </p>
            </div>
          </div>

          <Link
            href="/centre-de-langues/programmes"
            className="mt-10 inline-block rounded-lg bg-[#f97316] px-6 py-3 text-sm font-semibold text-white"
          >
            {pt.seePrograms} →
          </Link>
        </div>
      </section>
    </main>
  );
}