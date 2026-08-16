'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { CheckCircle, Loader2, FileText, Send, User, Mail, Phone, BookOpen, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function Evaluation() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    exam: '',
    level: '',
    objectives: '',
    pays: '',
    ville: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.name,
          email: formData.email,
          telephone: formData.phone,
          pays: formData.pays,
          ville: formData.ville,
          source: 'inscription', // Pour l'afficher dans les inscriptions admin
          formationTitre: language === 'fr' ? `Évaluation d'anglais : ${formData.exam.toUpperCase()}` : `English evaluation: ${formData.exam.toUpperCase()}`,
          message: language === 'fr' ? `Niveau actuel: ${formData.level} | Objectifs: ${formData.objectives}` : `Current level: ${formData.level} | Objectives: ${formData.objectives}`,
          date: new Date().toISOString()
        })
      })

      if (res.ok) {
        setSubmitted(true)
        // Rediriger vers WhatsApp après 1.5s
        setTimeout(() => {
          const waMessage = language === 'fr' 
            ? `Bonjour, je viens de demander une évaluation gratuite pour le ${formData.exam.toUpperCase()}.\n\nNom: ${formData.name}\nTéléphone: ${formData.phone}\nPays/Ville: ${formData.pays}/${formData.ville}\nNiveau actuel: ${formData.level}\nObjectifs: ${formData.objectives}`
            : `Hello, I'm requesting a free evaluation for ${formData.exam.toUpperCase()}.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nCountry/City: ${formData.pays}/${formData.ville}\nCurrent level: ${formData.level}\nObjectives: ${formData.objectives}`
          window.open(`https://wa.me/2290129239194?text=${encodeURIComponent(waMessage)}`, '_blank')
        }, 1500)
      } else {
        alert(language === 'fr' ? "Erreur lors de l'envoi de la demande." : "Error sending request.")
      }
    } catch {
      alert(language === 'fr' ? "Une erreur est survenue lors de l'envoi." : "An error occurred during sending.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 relative z-10 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {language === 'fr' ? 'Évaluation de Niveau' : 'Level Evaluation'} <span className="text-orange-500">{language === 'fr' ? 'Gratuite' : 'Free'}</span>
          </h1>
          <p className="text-orange-200/60 max-w-2xl mx-auto">
            {language === 'fr' ? 'Complétez ce formulaire d\'évaluation d\'anglais et nous vous contacterons pour valider votre niveau et vous proposer un plan de formation.' : 'Complete this English evaluation form and we will contact you to validate your level and propose a training plan.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Form Info Panel */}
          <div className="md:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-lg">{language === 'fr' ? 'Pourquoi s\'évaluer ?' : 'Why evaluate?'}</h3>
            <ul className="space-y-3 text-sm text-orange-100/70">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{language === 'fr' ? 'Identifier vos lacunes' : 'Identify your gaps'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{language === 'fr' ? 'Mesurer votre score théorique (TOEIC, TOEFL)' : 'Measure your theoretical score (TOEIC, TOEFL)'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{language === 'fr' ? 'Adapter le programme de formation' : 'Adapt the training program'}</span>
              </li>
            </ul>
          </div>

          {/* Form Panel */}
          <div className="md:col-span-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">{t.contact.name} *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-200/40" />
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                          placeholder={language === 'fr' ? 'Votre nom et prénom' : 'Your full name'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">{t.contact.email} *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-200/40" />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-orange-100 mb-2">{t.contact.phone} *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-200/40" />
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                          placeholder="+229 01..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Pays' : 'Country'} *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.pays}
                        onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                        className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                        placeholder={language === 'fr' ? 'ex: Bénin' : 'ex: Benin'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Ville' : 'City'} *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.ville}
                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                        className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                        placeholder={language === 'fr' ? 'ex: Cotonou' : 'ex: Cotonou'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Examen préparé *' : 'Prepared exam *'}</label>
                      <select 
                        required
                        value={formData.exam}
                        onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                        className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm [&>option]:bg-slate-900"
                      >
                        <option value="">{language === 'fr' ? 'Sélectionnez un examen' : 'Select an exam'}</option>
                        <option value="toeic">TOEIC</option>
                        <option value="toefl">TOEFL</option>
                        <option value="gre">GRE</option>
                        <option value="ielts">IELTS</option>
                        <option value="general">{language === 'fr' ? 'Anglais Général' : 'General English'}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Niveau actuel estimé' : 'Estimated current level'}</label>
                      <select 
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm [&>option]:bg-slate-900"
                      >
                        <option value="">{language === 'fr' ? 'Sélectionnez votre niveau' : 'Select your level'}</option>
                        <option value="debutant">{language === 'fr' ? 'Débutant (A1-A2)' : 'Beginner (A1-A2)'}</option>
                        <option value="intermediaire">{language === 'fr' ? 'Intermédiaire (B1-B2)' : 'Intermediate (B1-B2)'}</option>
                        <option value="avance">{language === 'fr' ? 'Avancé (C1-C2)' : 'Advanced (C1-C2)'}</option>
                        <option value="incertain">{language === 'fr' ? 'Je ne sais pas' : "I don't know"}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-orange-100 mb-2">{language === 'fr' ? 'Objectifs & Attentes' : 'Objectives & Expectations'}</label>
                    <textarea 
                      rows={4}
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                      placeholder={language === 'fr' ? 'Décrivez vos objectifs professionnels ou d\'études...' : 'Describe your professional or study objectives...'}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-500 disabled:bg-orange-600/50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {language === 'fr' ? 'Traitement...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {language === 'fr' ? 'Demander mon évaluation gratuite' : 'Request my free evaluation'}
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{language === 'fr' ? 'Demande Envoyée !' : 'Request Sent!'}</h3>
                  <p className="text-orange-100/70 max-w-xl mx-auto mb-6">
                    {language === 'fr' ? 'Votre demande d\'évaluation a bien été enregistrée. Nous vous redirigeons vers WhatsApp pour fixer un rendez-vous avec un conseiller.' : 'Your evaluation request has been registered. We will redirect you to WhatsApp to schedule an appointment with an advisor.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
