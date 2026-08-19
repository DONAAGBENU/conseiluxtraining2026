'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminSidebar from './Sidebar'
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  // Vérifier l'état de connexion au montage
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Ajout d'un timeout de 5 secondes pour éviter le chargement infini
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch('/api/auth/check', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        setAuthenticated(false)
        return
      }
      
      const data = await res.json()
      setAuthenticated(data.authenticated || false)
    } catch (error) {
      console.error('Erreur checkAuth:', error)
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setAuthenticated(true)
      } else {
        setError(data.error || 'Identifiants invalides')
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-800 mx-auto mb-4" />
          <p className="text-orange-800 font-medium">Chargement du panel d'administration...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Background blobs for premium styling */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-800/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/35">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center shadow-inner shadow-black/15 ring-1 ring-white/15 mb-4">
                <Image
                  src="/images/logo%20conseilux%20vectoriel%20%20%5BR%C3%A9cup%C3%A9r%C3%A9%5D_Plan%20de%20travail%201.png"
                  alt="Logo Conseilux Training"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                Espace <span className="text-orange-800">Administration</span>
              </h2>
              <p className="text-orange-800/60 text-sm mt-1">Connectez-vous pour gérer votre site</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-2xl text-sm mb-6 text-center">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">Adresse E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-800/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@conseiluxtraining.com"
                    className="w-full pl-12 pr-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-800/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-800/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-800 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-800/20 hover:bg-orange-700 disabled:bg-orange-800/50 disabled:cursor-not-allowed transition-colors mt-2"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white relative">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-800/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-64 w-96 h-96 bg-orange-800/5 rounded-full blur-3xl pointer-events-none" />

      <AdminSidebar onLogout={() => setAuthenticated(false)} />
      <div className="flex-1 flex flex-col relative z-10">
        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
