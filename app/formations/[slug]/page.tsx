"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { CheckCircle, Clock, Loader2, Mail, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function FormationDetail() {
  const { t, language } = useLanguage()
  const params = useParams()
  const slug = params?.slug as string
  const [formation, setFormation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    pays: '',
    ville: '',
    message: '',
    contactPreference: 'email' // 'email' or 'whatsapp'
  })
  const [formLoading, setFormLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        const formations = data.formations || []
        const found = formations.find(
          (f: any) => f.id === slug || f.titre.toLowerCase().replace(/ /g, '-') === slug
        )
        setFormation(found || null)
      })
      .catch(err => console.error(language === 'fr' ? 'Erreur chargement formation:' : 'Error loading training:', err))
      .finally(() => setLoading(false))
  }, [slug, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'inscription',
          formationTitre: formation.titre,
          date: new Date().toISOString()
        })
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          entreprise: '',
          pays: '',
          ville: '',
          message: '',
          contactPreference: 'email'
        })
        setTimeout(() => {
          setSuccess(false)
          setShowForm(false)
        }, 3000)
      } else {
        alert(language === 'fr' ? 'Erreur lors de l\'inscription' : 'Error during registration')
      }
    } catch (err) {
      alert(language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!formation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl text-orange-200/60">{language === 'fr' ? 'Formation non trouvée' : 'Training not found'}</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{formation.titre}</h1>
            <p className="text-xl text-orange-100 mt-4">{formation.categorie}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="card border-t-4 border-primary bg-white/10 backdrop-blur-md border-white/10">
              <p className="text-orange-100/90 text-lg">{formation.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <Clock className="w-6 h-6 text-orange-500 mx-auto" />
                  <p className="text-sm text-orange-200/80 mt-1">{formation.duree}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-2xl">💰</span>
                  <p className="text-sm text-orange-200/80 mt-1">{formation.prix}</p>
                </div>
                {formation.certifiante && (
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    <p className="text-sm text-green-400 mt-1">Certifiante</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-white mb-3">{language === 'fr' ? 'Modules de formation' : 'Training modules'}</h3>
                <ul className="space-y-2">
                  {formation.modules.map((module: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-orange-100/90">{module}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => setShowForm(true)}
                className="mt-8 inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/10"
              >
                {language === 'fr' ? 'S\'inscrire à cette formation' : 'Register for this training'}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Modal d'inscription */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{language === 'fr' ? 'Inscription' : 'Registration'} - {formation.titre}</h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-orange-200/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all"
              >
                ×
              </button>
            </div>

            {success && (
              <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400 text-sm font-medium">{language === 'fr' ? 'Inscription envoyée avec succès ! Nous vous contacterons bientôt.' : 'Registration sent successfully! We will contact you soon.'}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">{t.contact.name} *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">{t.contact.email} *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">{t.contact.phone} *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="+228 90 54 64 64"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Entreprise' : 'Company'}</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder={language === 'fr' ? 'Nom de votre entreprise' : 'Your company name'}
                  value={formData.entreprise}
                  onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Pays' : 'Country'}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder={language === 'fr' ? 'Togo' : 'Togo'}
                    value={formData.pays}
                    onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Ville' : 'City'}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder={language === 'fr' ? 'Lomé' : 'Lomé'}
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Message (optionnel)' : 'Message (optional)'}</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder={language === 'fr' ? 'Questions supplémentaires...' : 'Additional questions...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-3">{language === 'fr' ? 'Préférence de contact *' : 'Contact preference *'}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, contactPreference: 'email' })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.contactPreference === 'email'
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <Mail className="w-6 h-6 text-orange-400" />
                    <span className="text-sm font-medium">Email</span>
                    <span className="text-xs text-orange-200/50">contact@conseiluxtraining.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, contactPreference: 'whatsapp' })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.contactPreference === 'whatsapp'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <MessageSquare className="w-6 h-6 text-green-400" />
                    <span className="text-sm font-medium">WhatsApp</span>
                    <span className="text-xs text-orange-200/50">+228 90 54 64 64</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-500 disabled:bg-orange-600/50 disabled:cursor-not-allowed transition-colors mt-4"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {language === 'fr' ? 'Envoyer mon inscription' : 'Send my registration'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}