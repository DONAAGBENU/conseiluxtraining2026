// app/centre-de-langues/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const next = searchParams.get("next") || "/centre-de-langues/admin/programmes";
        router.push(next);
        router.refresh();
      } else {
        setError(data.error || "Email ou mot de passe incorrect.");
      }
    } catch {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f97316] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8"
      >
        <h1 className="text-lg font-semibold text-white">
          Administration — Conseilux Language Academy
        </h1>
        <p className="mt-1 text-xs text-white/70">
          Même identifiants que l&apos;admin du site principal.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-white/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="text-xs text-white/80">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-white"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-xs text-red-200">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-[#f97316] disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f97316] text-white">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}