'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { FileText, Download, CheckCircle, User, Mail, Phone, Loader2 } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  pays: string
  ville: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  pays?: string
  ville?: string
}

export default function CataloguePage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    pays: '',
    ville: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ── Validation ──────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }
    if (!formData.pays.trim()) {
      newErrors.pays = 'Le pays est requis'
    }
    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Soumission ──────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      // Sauvegarde du lead pour la page admin
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.name,
          email: formData.email,
          telephone: formData.phone,
          entreprise: formData.company,
          pays: formData.pays,
          ville: formData.ville,
          source: 'catalogue',
          date: new Date().toISOString(),
        }),
      })
    } catch {
      // En cas d'erreur API on continue quand même le téléchargement
    } finally {
      setLoading(false)
      setSubmitted(true)

      // Téléchargement automatique après 1 seconde
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = '/catalogue.pdf'
        link.download = 'Catalogue-Conseilux-Training.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 1000)
    }
  }

  // ── Gestion des champs ──────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Effacer l'erreur du champ en cours de saisie
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />

      <main className="flex-grow">

        {/* ── Hero ── */}
        <section className="relative py-20 text-white text-center overflow-hidden min-h-[300px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          />
          <div className="absolute inset-0 bg-orange-600/40" />
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Catalogue 2026-2027
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Découvrez l'ensemble de nos formations, certifications et solutions pour accélérer vos performances.
            </p>
          </div>
        </section>

        {/* ── Formulaire ── */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="card border-t-4 border-orange-600 p-10 shadow-2xl">

              <div className="text-center mb-10">
                <FileText className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white">Téléchargez le catalogue</h2>
                <p className="text-orange-200/60 mt-3 text-sm">
                  Remplissez le formulaire pour recevoir notre brochure complète et découvrir nos offres.
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-orange-100 mb-2">
                      Nom et prénom <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-200/40" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="ex: Jean Dupont"
                        className={`w-full pl-11 pr-4 rounded-2xl border py-3 bg-black/35 text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.name
                            ? 'border-red-400'
                            : 'border-white/10'
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Entreprise */}
                  <div>
                    <label className="block text-sm font-medium text-orange-100 mb-2">
                      Entreprise <span className="text-orange-200/40 text-xs">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="ex: Société Générale"
                      className="w-full px-4 py-3 rounded-2xl bg-black/35 border border-white/10 text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Pays & Ville */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">
                        Pays <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pays"
                        required
                        placeholder="ex: Togo"
                        className={`w-full px-4 py-3 rounded-2xl border bg-black/35 text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.pays ? 'border-red-400' : 'border-white/10'
                        }`}
                        value={formData.pays}
                        onChange={handleChange}
                      />
                      {errors.pays && (
                        <p className="text-red-400 text-xs mt-1">{errors.pays}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">
                        Ville <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ville"
                        required
                        placeholder="ex: Lomé"
                        className={`w-full px-4 py-3 rounded-2xl border bg-black/35 text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.ville ? 'border-red-400' : 'border-white/10'
                        }`}
                        value={formData.ville}
                        onChange={handleChange}
                      />
                      {errors.ville && (
                        <p className="text-red-400 text-xs mt-1">{errors.ville}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-orange-100 mb-2">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-200/40" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="ex: jean@entreprise.com"
                        className={`w-full pl-11 pr-4 rounded-2xl border py-3 bg-black/35 text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.email
                            ? 'border-red-400'
                            : 'border-white/10'
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-orange-100 mb-2">
                      Numéro de téléphone <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-200/40" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="ex: +228 90 00 00 00"
                        className={`w-full pl-11 pr-4 rounded-2xl border py-3 bg-black/35 text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.phone
                            ? 'border-red-400'
                            : 'border-white/10'
                        }`}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Bouton */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-500 disabled:bg-orange-600/50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Préparation...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Télécharger le catalogue
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-orange-200/40 mt-2">
                    Vos données sont confidentielles et ne seront jamais partagées.
                  </p>
                </form>

              ) : (
                /* ── État succès ── */
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Merci !</h3>
                  <p className="text-orange-200/80 max-w-xl mx-auto mb-6">
                    Votre demande a été enregistrée. Le téléchargement va commencer automatiquement.
                  </p>
                  <a
                    href="/catalogue.pdf"
                    download="Catalogue-Conseilux-Training.pdf"
                    className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-8 transition-colors shadow-lg shadow-orange-500/20"
                  >
                    <Download className="w-5 h-5" />
                    Cliquez ici si le téléchargement ne démarre pas
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}