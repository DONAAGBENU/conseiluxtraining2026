"use client";
// Composant header partagé pour toutes les pages admin du Centre de Langues.
// Inclut : switcher FR/EN, toggle dark mode, liens de navigation, déconnexion.

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun, Settings, LayoutDashboard, LogOut, Globe } from "lucide-react";
import { useLanguageCenter } from "./LanguageCenterProvider";

// Traductions mini pour l'interface admin
const adminT = {
  fr: {
    dashboard: "Tableau de bord",
    programmes: "Programmes",
    viewSite: "Voir le site",
    logout: "Déconnecter",
    title: "Administration",
    subtitle: "Conseilux Language Academy",
  },
  en: {
    dashboard: "Dashboard",
    programmes: "Programs",
    viewSite: "View site",
    logout: "Sign out",
    title: "Administration",
    subtitle: "Conseilux Language Academy",
  },
} as const;

interface AdminHeaderProps {
  /** Callback déconnexion — géré par le composant parent */
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const router = useRouter();
  const { language, setLanguage, darkMode, toggleDarkMode } = useLanguageCenter();
  const at = adminT[language as keyof typeof adminT];

  const headerBg = darkMode
    ? "bg-[#050d1f] border-white/10"
    : "bg-[#0a1128] border-white/10";

  return (
    <header className={`${headerBg} border-b text-white py-4 px-6 shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo + titre */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-transparent-original-colors-cropped.png"
            alt="Logo Conseilux"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <h1 className="text-base font-bold leading-tight">{at.title}</h1>
            <p className="text-xs text-white/70">{at.subtitle}</p>
          </div>
        </div>

        {/* Liens navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <button
            onClick={() => router.push("/centre-de-langues/admin/dashboard")}
            className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-[#ff6b00]" />
            {at.dashboard}
          </button>
          <button
            onClick={() => router.push("/centre-de-langues/admin/programmes")}
            className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-[#ff6b00]" />
            {at.programmes}
          </button>
          <Link
            href="/centre-de-langues"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {at.viewSite}
          </Link>
        </nav>

        {/* Contrôles droite */}
        <div className="flex items-center gap-2">
          {/* Switcher FR | EN */}
          <div className="flex items-center gap-0.5 rounded-full border border-white/20 p-0.5">
            <button
              onClick={() => setLanguage("fr")}
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                language === "fr"
                  ? "bg-[#ff6b00] text-white shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                language === "en"
                  ? "bg-[#ff6b00] text-white shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-full p-1.5 border border-white/20 hover:border-white/40 text-white/70 hover:text-white transition-all"
            aria-label={darkMode ? "Mode clair" : "Mode sombre"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Déconnexion */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-[#ff6b00] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#ff5500] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{at.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
