"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen, Users, TrendingUp, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import AdminHeader from "@/app/components/AdminLanguageHeader";
import { useLanguageCenter } from "@/app/components/LanguageCenterProvider";

// Traductions du tableau de bord
const dashT = {
  fr: {
    title: "Tableau de bord",
    totalProgrammes: "Total Programmes",
    totalInscriptions: "Total Inscriptions",
    weekInscriptions: "Inscriptions cette semaine",
    recentProgrammes: "Derniers programmes",
    quickActions: "Actions rapides",
    addProgramme: "Ajouter un programme",
    viewSite: "Voir le site public",
    seeAll: "Voir tout",
    noProgramme: "Aucun programme enregistré pour le moment.",
    loading: "Chargement...",
  },
  en: {
    title: "Dashboard",
    totalProgrammes: "Total Programs",
    totalInscriptions: "Total Enrollments",
    weekInscriptions: "Enrollments this week",
    recentProgrammes: "Recent programs",
    quickActions: "Quick actions",
    addProgramme: "Add a program",
    viewSite: "View public site",
    seeAll: "See all",
    noProgramme: "No programs registered yet.",
    loading: "Loading...",
  },
} as const;

export default function LanguageAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalProgrammes: 0,
    totalInscriptions: 0,
    recentInscriptions: 0,
  });
  const [recentProgrammes, setRecentProgrammes] = useState<any[]>([]);
  const router = useRouter();
  const { darkMode, language } = useLanguageCenter();
  const dt = dashT[language];

  // --- Auth ---
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

  // --- Redirect (never during render) ---
  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/centre-de-langues/admin/login");
    }
  }, [loading, authenticated, router]);

  // --- Fetch data once authenticated ---
  useEffect(() => {
    if (!authenticated || !supabase) return;
    async function fetchData() {
      try {
        const { data: programmes } = await supabase!
          .from("programmes")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: inscriptions } = await supabase!
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalProgrammes: programmes?.length || 0,
          totalInscriptions: inscriptions?.length || 0,
          recentInscriptions:
            inscriptions?.filter((i: any) => {
              const date = new Date(i.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return date > weekAgo;
            }).length || 0,
        });
        setRecentProgrammes(programmes || []);
      } catch (e) {
        console.error("Erreur fetchData:", e);
      }
    }
    fetchData();
  }, [authenticated]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/centre-de-langues/admin/login");
  };

  // --- Dark mode helpers ---
  const bg = darkMode ? "bg-[#050d1f] text-white" : "bg-gray-50 text-[#0a1128]";
  const cardBg = darkMode
    ? "bg-[#111c35] border-[#ff6b00]/30 text-white"
    : "bg-white border-[#ff6b00] text-[#0a1128]";
  const textMuted = darkMode ? "text-white/60" : "text-gray-600";
  const itemBg = darkMode
    ? "bg-[#1a2a45] border-[#ff6b00]/20"
    : "bg-[#ff6b00]/5 border-[#ff6b00]/20";

  // --- Loading state ---
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-[#050d1f]" : "bg-white"}`}>
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00]" />
      </div>
    );
  }

  if (!authenticated) return null;

  const statCards = [
    {
      label: dt.totalProgrammes,
      value: stats.totalProgrammes,
      icon: <BookOpen className="w-8 h-8" />,
      href: "/centre-de-langues/admin/programmes",
    },
    {
      label: dt.totalInscriptions,
      value: stats.totalInscriptions,
      icon: <Users className="w-8 h-8" />,
      href: "#",
    },
    {
      label: dt.weekInscriptions,
      value: stats.recentInscriptions,
      icon: <TrendingUp className="w-8 h-8" />,
      href: "#",
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg}`}>
      <AdminHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">{dt.title}</h2>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              onClick={() => stat.href !== "#" && router.push(stat.href)}
              className={`cursor-pointer border-2 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ${cardBg}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${textMuted}`}>{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="bg-[#ff6b00]/10 text-[#ff6b00] p-4 rounded-2xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Derniers programmes */}
          <div className={`border-2 rounded-2xl p-6 shadow-md ${cardBg}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{dt.recentProgrammes}</h3>
              <button
                onClick={() => router.push("/centre-de-langues/admin/programmes")}
                className="text-[#ff6b00] text-sm hover:underline font-medium flex items-center gap-1"
              >
                {dt.seeAll} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {recentProgrammes.length === 0 ? (
              <p className={`text-sm py-4 ${textMuted}`}>{dt.noProgramme}</p>
            ) : (
              <div className="space-y-3">
                {recentProgrammes.map((prog) => (
                  <div
                    key={prog.id}
                    className={`border rounded-xl p-4 flex justify-between items-center ${itemBg}`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{prog.nom}</p>
                      <p className={`text-xs mt-0.5 ${textMuted}`}>
                        {prog.duree} · {prog.niveau_cible}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#ff6b00]">{prog.prix}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className={`border-2 rounded-2xl p-6 shadow-md ${cardBg}`}>
            <h3 className="font-bold text-lg mb-4">{dt.quickActions}</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/centre-de-langues/admin/programmes")}
                className="w-full bg-[#ff6b00] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#ff5500] transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {dt.addProgramme}
              </button>
              <button
                onClick={() => router.push("/centre-de-langues")}
                className="w-full bg-[#ff6b00] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#ff5500] transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                {dt.viewSite}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
