"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, BookOpen, UserPlus, Award, Menu, X, ArrowLeft, Moon, Sun } from "lucide-react";
import { useLanguageCenter } from "./LanguageCenterProvider";

export default function LanguageHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, darkMode, toggleDarkMode, t } = useLanguageCenter();

  const navItems = [
    { label: t.nav.home, href: "/centre-de-langues", icon: Home },
    { label: t.nav.programmes, href: "/centre-de-langues/programmes", icon: BookOpen },
    { label: t.nav.inscription, href: "/centre-de-langues/inscription", icon: UserPlus },
    { label: t.nav.certifications, href: "/centre-de-langues/certifications", icon: Award },
  ];

  const headerBg = darkMode
    ? "bg-[#050b1a]/98 border-white/10"
    : "bg-[#0a1128]/95 border-white/10";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md text-white transition-colors duration-300 ${headerBg}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo / Title */}
        <Link href="/centre-de-langues" className="flex items-center gap-2.5 sm:gap-3 group">
          <Image
            src="/images/logo-transparent-original-colors-cropped.png"
            alt="Logo Conseilux"
            width={42}
            height={42}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-wider text-white leading-tight">
              CONSEILUX
            </span>
            <span className="text-[10px] sm:text-xs italic font-serif text-[#ff6b00]">
              INSTITUTE OF LANGUAGES & INTERNATIONAL CERTIFICATIONS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#ff6b00] ${
                  isActive ? "text-[#ff6b00]" : "text-white/80"
                }`}
              >
                <Icon className="w-4 h-4 text-[#ff6b00]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <span className="h-4 w-px bg-white/20" />

          {/* Language Switcher FR / EN */}
          <div className="flex items-center gap-1 rounded-full border border-white/20 p-0.5 bg-black/20">
            <button
              onClick={() => setLanguage("fr")}
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors ${
                language === "fr"
                  ? "bg-[#ff6b00] text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
              aria-label="Français"
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors ${
                language === "en"
                  ? "bg-[#ff6b00] text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? t.lightMode : t.darkMode}
            className="rounded-full p-1.5 border border-white/20 hover:border-white/40 text-white/70 hover:text-white transition-colors"
            aria-label={darkMode ? t.lightMode : t.darkMode}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <span className="h-4 w-px bg-white/20" />

          {/* Fixed Stable "Retour au site" Link */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/15 border border-white/15 hover:border-[#ff6b00]/50 rounded-full px-3 py-1.5 transition-all shadow-sm shrink-0 whitespace-nowrap min-w-[145px]"
            title={t.nav.backToSite}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#ff6b00] shrink-0" />
            <span className="truncate">{t.nav.backToSite}</span>
          </Link>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Quick Back to Site button for Mobile Topbar */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-2.5 py-1 transition-all shrink-0 whitespace-nowrap sm:min-w-[135px]"
            title={t.nav.backToSite}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#ff6b00] shrink-0" />
            <span className="hidden sm:inline text-[11px] font-medium truncate">
              {t.nav.backToSite}
            </span>
          </Link>

          {/* Language Switcher mobile */}
          <div className="flex items-center gap-0.5 rounded-full border border-white/20 p-0.5 bg-black/20">
            <button
              onClick={() => setLanguage("fr")}
              className={`rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${
                language === "fr" ? "bg-[#ff6b00] text-white shadow-sm" : "text-white/60"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${
                language === "en" ? "bg-[#ff6b00] text-white shadow-sm" : "text-white/60"
              }`}
            >
              EN
            </button>
          </div>

          {/* Dark mode mobile */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-1.5 hover:bg-white/10 text-white/70"
            aria-label={darkMode ? t.lightMode : t.darkMode}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-1.5 hover:bg-white/10 text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <nav
          className={`border-t border-white/10 px-6 py-4 md:hidden flex flex-col gap-3 transition-colors duration-300 ${
            darkMode ? "bg-[#050b1a]/98" : "bg-[#0a1128]/98"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 text-sm font-medium py-2 transition-colors ${
                  isActive ? "text-[#ff6b00]" : "text-white/80"
                }`}
              >
                <Icon className="w-5 h-5 text-[#ff6b00]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Stable "Retour au site" Button in Mobile Menu */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between text-sm text-white/90 hover:text-white bg-white/5 hover:bg-[#ff6b00]/10 border border-white/15 hover:border-[#ff6b00]/40 rounded-xl p-3.5 mt-2 transition-colors shadow-sm"
          >
            <span className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-[#ff6b00]" />
              <span className="font-semibold">{t.nav.backToSite}</span>
            </span>
            <span className="text-xs text-white/40 hover:text-white/70 transition-colors font-medium">
              Conseilux Training →
            </span>
          </Link>
        </nav>
      )}
    </header>
  );
}

