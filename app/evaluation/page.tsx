'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { CheckCircle, Loader2, Send, User, Mail, Phone, BookOpen, MapPin, Award, Check } from 'lucide-react'
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
          source: 'inscription',
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-3.5 py-1.5 rounded-full mb-3">
              {language === 'fr' ? 'Diagnostic & Orientation' : 'Assessment & Guidance'}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {language === 'fr' ? 'Évaluation de Niveau' : 'Language Level Evaluation'}{' '}
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {language === 'fr' ? 'Gratuite' : 'Free'}
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
              {language === 'fr' 
                ? 'Complétez ce formulaire d\'évaluation linguistique et nos experts vous contacteront sous 24h pour analyser votre niveau CECRL et bâtir votre parcours sur-mesure.' 
                : 'Complete this language evaluation form and our advisors will contact you within 24 hours to analyze your CEFR level and build a tailored training path.'}
            </p>
          </div>
        </section>

        {/* Form and Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Info Panel */}
              <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                    {language === 'fr' ? 'Pourquoi s\'évaluer ?' : 'Why take an evaluation?'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'fr' ? 'Une étape clé pour garantir une progression rapide et mesurable.' : 'A key step to ensure fast and measurable progress.'}
                  </p>
                </div>

                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'fr' ? 'Identifier précisément vos forces et vos lacunes' : 'Accurately identify your strengths and gaps'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'fr' ? 'Estimer votre score théorique (TOEIC, TOEFL, IELTS)' : 'Estimate your baseline score (TOEIC, TOEFL, IELTS)'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'fr' ? 'Obtenir un plan d\'études personnalisé et finançable' : 'Receive a personalized, funding-eligible study plan'}</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                      100%
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs">
                        {language === 'fr' ? 'Gratuit & Sans Engagement' : 'Free & No Obligation'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {language === 'fr' ? 'Réponse garantie sous 24h ouvrées' : 'Guaranteed reply within 24 working hours'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Panel */}
              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.contact.name} *</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                              placeholder={language === 'fr' ? 'Votre nom et prénom' : 'Your full name'}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.contact.email} *</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="email" 
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                              placeholder="votre@email.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.contact.phone} *</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="tel" 
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                              placeholder="+228 90 00 00 00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{language === 'fr' ? 'Pays' : 'Country'} *</label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              required
                              value={formData.pays}
                              onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                              placeholder={language === 'fr' ? 'ex: Togo, Bénin...' : 'e.g. Togo, Benin...'}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{language === 'fr' ? 'Ville' : 'City'} *</label>
                          <input 
                            type="text" 
                            required
                            value={formData.ville}
                            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                            placeholder={language === 'fr' ? 'ex: Lomé, Cotonou' : 'e.g. Lomé, Cotonou'}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{language === 'fr' ? 'Examen visé *' : 'Target exam *'}</label>
                          <div className="relative">
                            <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select 
                              required
                              value={formData.exam}
                              onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm [&>option]:bg-white dark:[&>option]:bg-slate-900"
                            >
                              <option value="">{language === 'fr' ? 'Sélectionnez un examen' : 'Select an exam'}</option>
                              <option value="toeic">TOEIC (Listening & Reading)</option>
                              <option value="toefl">TOEFL iBT</option>
                              <option value="ielts">IELTS Academic / General</option>
                              <option value="gre">GRE (Graduate Record Exam)</option>
                              <option value="general">{language === 'fr' ? 'Anglais Professionnel des Affaires' : 'Business English'}</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{language === 'fr' ? 'Niveau actuel estimé' : 'Estimated current level'}</label>
                          <div className="relative">
                            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select 
                              value={formData.level}
                              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm [&>option]:bg-white dark:[&>option]:bg-slate-900"
                            >
                              <option value="">{language === 'fr' ? 'Sélectionnez votre niveau' : 'Select your level'}</option>
                              <option value="debutant">{language === 'fr' ? 'Débutant (A1-A2)' : 'Beginner (A1-A2)'}</option>
                              <option value="intermediaire">{language === 'fr' ? 'Intermédiaire (B1-B2)' : 'Intermediate (B1-B2)'}</option>
                              <option value="avance">{language === 'fr' ? 'Avancé (C1-C2)' : 'Advanced (C1-C2)'}</option>
                              <option value="incertain">{language === 'fr' ? 'Je ne sais pas' : "I don't know"}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {language === 'fr' ? 'Objectifs & Projets professionnels' : 'Objectives & Professional Projects'}
                        </label>
                        <textarea 
                          rows={3}
                          value={formData.objectives}
                          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                          placeholder={language === 'fr' ? 'Ex: Promotion interne, études à l\'international, score 850+ au TOEIC...' : 'E.g. Internal promotion, studies abroad, 850+ TOEIC target...'}
                        />
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3.5 text-white text-base font-semibold shadow-md shadow-orange-600/20 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {language === 'fr' ? 'Traitement en cours...' : 'Processing...'}
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
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {language === 'fr' ? 'Demande Envoyée avec Succès !' : 'Request Sent Successfully!'}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 text-sm">
                        {language === 'fr' 
                          ? 'Votre demande d\'évaluation a bien été enregistrée. Nous vous redirigeons vers WhatsApp pour convenir d\'un créneau d\'évaluation.' 
                          : 'Your request has been registered. You are being redirected to WhatsApp to schedule your evaluation session.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

