'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Star, Calendar, MessageSquare, Loader2, X, Send, CheckCircle } from 'lucide-react'
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

  useEffect(() => {
    fetchApprovedAvis()
  }, [])

  const fetchApprovedAvis = async () => {
    try {
      const res = await fetch('/api/avis?approved=true')
      const data = await res.json()
      setTestimonials(data.avis || [])
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date().toLocaleDateString('fr-FR'),
          logo: '',
          approuve: false
        })
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ nom: '', role: '', entreprise: '', texte: '', note: 5, email: '', telephone: '' })
        setTimeout(() => {
          setSuccess(false)
          setShowForm(false)
        }, 3000)
      } else {
        alert(language === 'fr' ? 'Erreur lors de l\'envoi de l\'avis' : 'Error sending review')
      }
    } catch (err) {
      alert(language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{t.reviews.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {language === 'fr' ? 'Ce que nos clients disent de leurs expériences avec ConseiluxTraining' : 'What our clients say about their experiences with ConseiluxTraining'}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowForm(true)}
                className="bg-orange-800 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-orange-800/10"
              >
                <MessageSquare className="w-5 h-5" />
                {t.reviews.addReview}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[30vh]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-800" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl max-w-xl mx-auto">
                <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 font-medium">{t.reviews.noReviews}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="card border-t-4 border-orange-800 hover:-translate-y-1 transition-all bg-white/10 backdrop-blur-md border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex text-white mb-3">
                        {[...Array(testimonial.note)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-white/90 mb-6 italic text-sm font-light leading-relaxed">
                        &quot;{testimonial.texte}&quot;
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white font-bold text-base">
                          {testimonial.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{testimonial.nom}</p>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/60 mt-0.5">
                            <span>{testimonial.role}</span>
                            {testimonial.role && testimonial.entreprise && <span>•</span>}
                            <span>{testimonial.entreprise}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/40 mt-3 flex items-center gap-1">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{t.reviews.reviewFormTitle}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {success && (
              <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400 text-sm font-medium">{language === 'fr' ? 'Avis envoyé avec succès ! Il sera publié après modération.' : 'Review sent successfully! It will be published after moderation.'}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">{t.reviews.yourName} *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                  placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">{language === 'fr' ? 'Votre rôle' : 'Your role'}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                    placeholder={language === 'fr' ? 'ex: Directeur, Consultant...' : 'e.g. Director, Consultant...'}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">{language === 'fr' ? 'Entreprise' : 'Company'}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                    placeholder={language === 'fr' ? 'Nom de votre entreprise' : 'Your company name'}
                    value={formData.entreprise}
                    onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">{language === 'fr' ? 'Email (optionnel)' : 'Email (optional)'}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">{language === 'fr' ? 'Téléphone (optionnel)' : 'Phone (optional)'}</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                    placeholder="+228 90 54 64 64"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">{t.reviews.yourRating} *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, note: star })}
                      className="p-2 transition-all"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.note
                            ? 'text-white fill-current'
                            : 'text-white/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">{t.reviews.yourComment} *</label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                  placeholder={language === 'fr' ? 'Partagez votre expérience avec ConseiluxTraining...' : 'Share your experience with ConseiluxTraining...'}
                  value={formData.texte}
                  onChange={(e) => setFormData({ ...formData, texte: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-800 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-700 disabled:bg-orange-800/50 disabled:cursor-not-allowed transition-colors mt-4"
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