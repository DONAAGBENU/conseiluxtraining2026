'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, ChevronRight, Send, Loader2 } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface Training {
  id: string
  formationId: string
  formationTitre: string
  lieu: string
  date: string
  duree: string
  places: number
  disponibles: number
}

export default function TrainingDates() {
  const { t, language } = useLanguage()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
    pays: '',
    ville: ''
  })

  useEffect(() => {
    fetchDates()
  }, [])

  const fetchDates = async () => {
    try {
      const res = await fetch('/api/dates')
      const data = await res.json()
      setTrainings(data.dates || [])
    } catch (err) {
      console.error(language === 'fr' ? 'Erreur lors du chargement des sessions:' : 'Error loading sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = (training: Training) => {
    setSelectedTraining(training)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // 1. Enregistrer dans la base de données (leads.json)
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
          source: 'inscription',
          formationTitre: selectedTraining?.formationTitre,
          message: formData.message,
          date: new Date().toISOString()
        })
      })

      // 2. Rediriger vers WhatsApp
      const messageText = language === 'fr'
        ? `Bonjour, je souhaite m'inscrire à la formation : ${selectedTraining?.formationTitre}\n\nNom: ${formData.name}\nTéléphone: ${formData.phone}\nEmail: ${formData.email}\nPays: ${formData.pays}\nVille: ${formData.ville}\nEntreprise: ${formData.company}\n\nMessage: ${formData.message}`
        : `Hello, I would like to register for the training: ${selectedTraining?.formationTitre}\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nCountry: ${formData.pays}\nCity: ${formData.ville}\nCompany: ${formData.company}\n\nMessage: ${formData.message}`
        
      const phoneNumber = '2290129239194'
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`, '_blank')

      setShowForm(false)
      setFormData({ name: '', phone: '', email: '', company: '', message: '', pays: '', ville: '' })
    } catch (err) {
      console.error("Erreur:", err)
      alert(language === 'fr' ? "Une erreur est survenue lors de l'enregistrement." : "An error occurred during registration.")
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-transparent">
        <div className="flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </div>
      </section>
    )
  }

  if (trainings.length === 0) {
    return (
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title">{t.trainingDates.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4">{t.trainingDates.noDates}</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">{t.trainingDates.checkBack}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">{t.trainingDates.title}</h2>
          <p className="section-subtitle">
            {t.trainingDates.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <div key={training.id} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-xl p-6 border-t-4 border-t-orange-600 transition-all flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{training.formationTitre}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                    training.disponibles > 5
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : training.disponibles > 0
                      ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                      : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                  }`}>
                    {training.disponibles > 0 ? `${training.disponibles} ${t.trainingDates.places}` : t.trainingDates.complet}
                  </span>
                </div>
                
                <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>{training.lieu}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>{training.date}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>{training.duree}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>{training.places} {t.trainingDates.maxParticipants}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(training)}
                disabled={training.disponibles === 0}
                className={`w-full mt-6 px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  training.disponibles > 0
                    ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20 active:scale-[0.98]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                {training.disponibles > 0 ? (
                  <>
                    <span>{t.trainingDates.register}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  t.trainingDates.complet
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Modal d'inscription */}
        {showForm && selectedTraining && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto text-slate-800 dark:text-white shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.trainingDates.registration}</h3>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold mt-1">{selectedTraining.formationTitre}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedTraining.lieu} - {selectedTraining.date}</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full text-xl leading-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.trainingDates.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.trainingDates.fullNamePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.trainingDates.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.trainingDates.phonePlaceholder}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.trainingDates.country}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      value={formData.pays}
                      onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                      placeholder={t.trainingDates.countryPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.trainingDates.city}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      placeholder={t.trainingDates.cityPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.trainingDates.email}
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.trainingDates.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.trainingDates.company}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t.trainingDates.companyPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.trainingDates.message}
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.trainingDates.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 text-sm shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all cursor-pointer mt-2"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.trainingDates.loading}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.trainingDates.submit}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}