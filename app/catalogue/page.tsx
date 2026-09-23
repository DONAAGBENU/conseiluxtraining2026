'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { FileText, Download, CheckCircle, User, Mail, Phone, Loader2 } from 'lucide-react'
import { useLanguage } from '@/app/components/LanguageProvider'

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
  const { t, language } = useLanguage()
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
      newErrors.name = language === 'fr' ? 'Le nom est requis' : 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = language === 'fr' ? "L'email est requis" : 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'Email invalide' : 'Invalid email'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'fr' ? 'Le téléphone est requis' : 'Phone is required'
    }
    if (!formData.pays.trim()) {
      newErrors.pays = language === 'fr' ? 'Le pays est requis' : 'Country is required'
    }
    if (!formData.ville.trim()) {
      newErrors.ville = language === 'fr' ? 'La ville est requise' : 'City is required'
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

      // Track catalogue download in analytics
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'catalogue_download',
          page: '/catalogue',
          metadata: {
            user_email: formData.email,
            user_name: formData.name,
            timestamp: new Date().toISOString()
          }
        })
      })
    } catch {
      // En cas d'erreur API on continue quand même le téléchargement
    } finally {
      setLoading(false)
      setSubmitted(true)

      // Téléchargement automatique après 1 seconde
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = '/catalogue/catalogue.pdf'
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />

      <main className="flex-grow">

        {/* ── Hero ── */}
        <section className="py-14 md:py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t.catalogue.title}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.catalogue.description}
            </p>
          </div>
        </section>

        {/* ── Formulaire ── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border-t-4 border-t-orange-600">

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{t.catalogue.download}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs md:text-sm">
                  {language === 'fr' ? 'Remplissez le formulaire ci-dessous pour recevoir notre brochure complète et le détail de nos parcours certifiants.' : 'Fill out the form below to receive our complete brochure and certification details.'}
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Nom */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.catalogue.fields.name} <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={language === 'fr' ? 'ex: Jean Dupont' : 'ex: John Doe'}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.name
                            ? 'border-red-400'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Entreprise */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.catalogue.fields.company} <span className="text-slate-400 text-xs">({language === 'fr' ? 'optionnel' : 'optional'})</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder={language === 'fr' ? 'ex: Société Générale' : 'ex: General Company'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Pays & Ville */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'fr' ? 'Pays' : 'Country'} <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="pays"
                        required
                        placeholder={language === 'fr' ? 'ex: Togo' : 'ex: Togo'}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.pays ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                        }`}
                        value={formData.pays}
                        onChange={handleChange}
                      />
                      {errors.pays && (
                        <p className="text-red-500 text-xs mt-1">{errors.pays}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'fr' ? 'Ville' : 'City'} <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="ville"
                        required
                        placeholder={language === 'fr' ? 'ex: Lomé' : 'e.g. Lome'}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.ville ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                        }`}
                        value={formData.ville}
                        onChange={handleChange}
                      />
                      {errors.ville && (
                        <p className="text-red-500 text-xs mt-1">{errors.ville}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email professionnel <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="ex: jean@entreprise.com"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.email
                            ? 'border-red-400'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'fr' ? 'Numéro de téléphone' : 'Phone number'} <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={language === 'fr' ? 'ex: +228 90 00 00 00' : 'e.g. +228 90 00 00 00'}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm ${
                          errors.phone
                            ? 'border-red-400'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Bouton */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-3.5 text-white font-semibold shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all cursor-pointer text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {language === 'fr' ? 'Préparation...' : 'Preparing...'}
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {t.catalogue.download}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {language === 'fr' ? 'Vos données sont confidentielles et ne seront jamais partagées.' : 'Your data is confidential and will never be shared.'}
                  </p>
                </form>

              ) : (
                /* ── État succès ── */
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{language === 'fr' ? 'Merci !' : 'Thank you!'}</h3>
                  <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 text-sm">
                    {language === 'fr' ? 'Votre demande a été enregistrée. Le téléchargement va démarrer automatiquement.' : 'Your request has been registered. The download will start automatically.'}
                  </p>
                  <a
                    href="/catalogue/catalogue.pdf"
                    download="Catalogue-Conseilux-Training.pdf"
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 text-sm transition-all shadow-md shadow-orange-600/20"
                  >
                    <Download className="w-4 h-4" />
                    {language === 'fr' ? 'Télécharger manuellement le catalogue' : 'Download catalog manually'}
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