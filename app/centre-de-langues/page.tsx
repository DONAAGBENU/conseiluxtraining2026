// app/centre-de-langues/page.tsx
// Conseilux Language Academy — bilingue FR/EN + dark mode toggle
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguageCenter } from "../components/LanguageCenterProvider";

const LEVELS = [
  { code: "A1", labelFr: "Débutant", labelEn: "Beginner" },
  { code: "A2", labelFr: "Élémentaire", labelEn: "Elementary" },
  { code: "B1", labelFr: "Intermédiaire", labelEn: "Intermediate" },
  { code: "B2", labelFr: "Inter. Sup.", labelEn: "Upper Int." },
  { code: "C1", labelFr: "Avancé", labelEn: "Advanced" },
] as const;

const SLIDER_IMAGES = ["/images/hero3.jpeg", "/images/hero6.jpeg"];

export default function CentreDeLanguesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { darkMode, language, t } = useLanguageCenter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode color helpers
  const bgMain = darkMode ? "bg-[#050d1f] text-white" : "bg-white text-[#0a1128]";
  const bgSection = darkMode ? "bg-[#0a1530]" : "bg-white";
  const textMuted = darkMode ? "text-white/60" : "text-[#0a1128]/60";
  const textBody = darkMode ? "text-white/80" : "text-[#0a1128]/80";
  const cardBg = darkMode ? "bg-[#111c35]" : "bg-white";
  const borderColor = darkMode ? "border-[#ff6b00]/20 bg-[#ff6b00]/5" : "border-[#ff6b00]/10 bg-[#ff6b00]/10";

  return (
    <main className={`${bgMain} transition-colors duration-300`}>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-[#ff6b00] text-white">
        {/* Slider */}
        <div className="absolute inset-0 z-0">
          {SLIDER_IMAGES.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/70">
            {t.hero.badge}
          </p>
          <h1
            className="max-w-3xl text-4xl leading-[1.05] md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="italic text-white">{t.hero.title1}</span>{" "}
            {t.hero.title2}
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            {t.hero.subtitle}
          </p>

          {/* Ladder A1 → C1 */}
          <div className="mt-14 flex flex-wrap items-center gap-0 md:gap-1">
            {LEVELS.map((lvl, i) => (
              <div key={lvl.code} className="flex items-center">
                <div className="group flex flex-col items-center">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full border text-sm font-semibold transition-colors md:h-16 md:w-16"
                    style={{
                      borderColor: "#ffffff",
                      color: i === LEVELS.length - 1 ? "#ff6b00" : "#ffffff",
                      backgroundColor:
                        i === LEVELS.length - 1 ? "#ffffff" : "transparent",
                    }}
                  >
                    {lvl.code}
                  </span>
                  <span className="mt-2 text-[11px] uppercase tracking-wide text-white/50">
                    {language === "fr" ? lvl.labelFr : lvl.labelEn}
                  </span>
                </div>
                {i < LEVELS.length - 1 && (
                  <span className="mx-2 h-px w-8 bg-white/20 md:w-14" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <a
              href="#admission"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#ff6b00] transition-transform hover:-translate-y-0.5 shrink-0 whitespace-nowrap min-w-[180px]"
            >
              {t.hero.ctaAdmission}
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 shrink-0 whitespace-nowrap min-w-[240px]"
            >
              {t.hero.ctaBack}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 5 PÔLES ---------- */}
      <section className={`mx-auto max-w-6xl px-6 py-20 ${bgSection} transition-colors duration-300`}>
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <h2
              className="text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.poles.sectionTitle}
            </h2>
            <p className={`mt-3 max-w-2xl ${textMuted}`}>
              {t.poles.sectionSubtitle}
            </p>

            <div className={`mt-12 grid gap-px overflow-hidden rounded-2xl border ${borderColor} md:grid-cols-2 lg:grid-cols-3`}>
              {t.poles.items.map((p) => (
                <div key={p.n} className={`${cardBg} p-6 transition-colors duration-300`}>
                  <span className="text-xs font-semibold text-[#ff6b00]">{p.n}</span>
                  <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-80">
            <div className="relative h-96 w-full">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=600&fit=crop"
                alt="Language learning"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROGRAMME PHARE ---------- */}
      <section className="bg-[#ff6b00] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">
            {t.flagship.label}
          </p>
          <h2
            className="mt-3 text-2xl md:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.flagship.title}
          </h2>
          <p className="mt-3 max-w-2xl text-white/90">{t.flagship.subtitle}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.flagship.trimesters.map((tr) => (
              <div
                key={tr.n}
                className="rounded-2xl border-2 border-white/30 bg-white/10 p-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-white">{tr.n}</span>
                  <span className="text-xs text-white/70">{tr.duree}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{tr.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {tr.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="text-white">—</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ADMISSION ---------- */}
      <section
        id="admission"
        className={`mx-auto max-w-6xl px-6 py-20 transition-colors duration-300`}
      >
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <h2
              className="text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.admission.sectionTitle}
            </h2>
            <p className={`mt-3 max-w-2xl ${textMuted}`}>
              {t.admission.sectionSubtitle}
            </p>

            <ol className="mt-12 space-y-0">
              {t.admission.steps.map((step, i) => (
                <li
                  key={i}
                  className={`flex gap-5 border-t py-4 first:border-t-0 ${
                    darkMode ? "border-[#ff6b00]/20" : "border-[#ff6b00]/10"
                  }`}
                >
                  <span className="w-6 shrink-0 text-sm font-semibold text-[#ff6b00]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-sm ${textBody}`}>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-14 rounded-2xl bg-[#ff6b00] p-8 text-white md:p-12">
              <h3
                className="text-xl md:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.admission.ctaTitle}
              </h3>
              <p className="mt-2 max-w-xl text-white/90">{t.admission.ctaSubtitle}</p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#ff6b00]"
              >
                {t.admission.ctaButton}
              </Link>
            </div>
          </div>
          <div className="hidden lg:block w-80">
            <div className="relative h-96 w-full">
              <img
                src="https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Admissions 2026-2027"
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