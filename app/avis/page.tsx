'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Star, Calendar, MessageSquare, Loader2, X, Send, CheckCircle, Quote } from 'lucide-react'
import { useLanguage } from '@/app/components/LanguageProvider'

interface Testimonial {
  id: string
  nom: string
  role: string
  entreprise: string
  texte: string
  note: number
  date: string
  logo: string
  approuve: boolean
}

export default function Avis() {
  const { t, language } = useLanguage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    role: '',
    entreprise: '',
    texte: '',
    note: 5,
    email: '',
    telephone: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchApprovedAvis(controller.signal)
    return () => controller.abort()
  }, [])

  const fetchApprovedAvis = async (signal: AbortSignal) => {
    try {
      const timeoutId = setTimeout(() => signal.dispatchEvent(new Event('abort')), 8000)
      
      const res = await fetch('/api/avis?approved=true', { signal })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        setTestimonials([])
        return
      }
      
      const data = await res.json()
      setTestimonials(data.avis || [])
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      console.error('Erreur lors du chargement des avis:', err)
      setTestimonials([])
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom.trim(),
          role: formData.role.trim(),
          entreprise: formData.entreprise.trim(),
          texte: formData.texte.trim(),
          note: formData.note,
          email: formData.email.trim(),
          telephone: formData.telephone.trim(),
          date: new Date().toLocaleDateString('fr-FR'),
          logo: '',
          approuve: false
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setFormData({ nom: '', role: '', entreprise: '', texte: '', note: 5, email: '', telephone: '' })
        setTimeout(() => {
          setSuccess(false)
          setShowForm(false)
        }, 3000)
      } else {
        setError(data.error || (language === 'fr' ? 'Erreur lors de l\'envoi de l\'avis' : 'Error sending review'))
      }
    } catch {
      setError(language === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'An error occurred. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-3.5 py-1.5 rounded-full mb-3">
              {language === 'fr' ? 'Témoignages & Retours' : 'Testimonials & Reviews'}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t.reviews.title}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              {language === 'fr' 
                ? 'Ce que nos apprenants, cadres et dirigeants partenaires disent de l\'impact des formations ConseiluxTraining.' 
                : 'What our learners, executives, and partner managers say about ConseiluxTraining programs.'}
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-orange-600/20 hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              {t.reviews.addReview}
            </button>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === 'fr' ? 'Chargement des témoignages...' : 'Loading reviews...'}
                </p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto p-8">
                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">{t.reviews.noReviews}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {language === 'fr' ? 'Soyez le premier à partager votre expérience !' : 'Be the first to share your experience!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/40 transition-all flex flex-col justify-between relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex text-amber-500">
                          {[...Array(testimonial.note || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500" />
                          ))}
                        </div>
                        <Quote className="w-6 h-6 text-slate-200 dark:text-slate-800 group-hover:text-orange-500/20 transition-colors" />
                      </div>
                      
                      <p className="text-slate-700 dark:text-slate-300 mb-6 italic text-sm leading-relaxed">
                        &ldquo;{testimonial.texte}&rdquo;
                      </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
                          {testimonial.nom ? testimonial.nom.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{testimonial.nom}</p>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <span>{testimonial.role}</span>
                            {testimonial.role && testimonial.entreprise && <span>•</span>}
                            <span>{testimonial.entreprise}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {testimonial.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal d'ajout d'avis */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t.reviews.reviewFormTitle}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {success && (
              <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                  {language === 'fr' ? 'Avis envoyé avec succès ! Il sera publié après validation.' : 'Review sent successfully! It will be published after moderation.'}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 flex items-center gap-3">
                <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <p className="text-rose-700 dark:text-rose-300 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.reviews.yourName} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Votre rôle / fonction' : 'Your role'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder={language === 'fr' ? 'ex: Directeur IT, Consultant...' : 'e.g. IT Director, Consultant...'}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Entreprise' : 'Company'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder={language === 'fr' ? 'Nom de votre entreprise' : 'Your company name'}
                    value={formData.entreprise}
                    onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Email (optionnel)' : 'Email (optional)'}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Téléphone (optionnel)' : 'Phone (optional)'}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="+228 90 54 64 64"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.reviews.yourRating} *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, note: star })}
                      className="p-1.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formData.note
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.reviews.yourComment} *
                </label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder={language === 'fr' ? 'Partagez votre expérience avec ConseiluxTraining...' : 'Share your experience with ConseiluxTraining...'}
                  value={formData.texte}
                  onChange={(e) => setFormData({ ...formData, texte: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-white text-base font-semibold shadow-md shadow-orange-600/20 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t.reviews.submitReview}
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