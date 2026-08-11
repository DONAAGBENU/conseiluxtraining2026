'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, ChevronRight, Send, Loader2, Globe } from 'lucide-react'

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
      console.error('Erreur lors du chargement des sessions:', err)
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
      const messageText = `Bonjour, je souhaite m'inscrire à la formation : ${selectedTraining?.formationTitre}\n\nNom: ${formData.name}\nTéléphone: ${formData.phone}\nEmail: ${formData.email}\nPays: ${formData.pays}\nVille: ${formData.ville}\nEntreprise: ${formData.company}\n\n${formData.message}`
      const phoneNumber = '2290129239194'
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`, '_blank')

      setShowForm(false)
      setFormData({ name: '', phone: '', email: '', company: '', message: '', pays: '', ville: '' })
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err)
      alert("Une erreur est survenue lors de l'enregistrement.")
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
          <h2 className="section-title">Dates de Formation</h2>
          <p className="text-orange-200/60 mt-4">Aucune date de formation disponible pour le moment.</p>
          <p className="text-orange-200/40 text-sm mt-2">Revenez plus tard pour découvrir nos prochaines sessions.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-transparent border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Dates de Formation</h2>
          <p className="section-subtitle text-orange-200/60">
            Inscrivez-vous dès maintenant à nos prochaines sessions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <div key={training.id} className="card border-t-4 border-orange-600 hover:-translate-y-1 transition-all bg-white/10 backdrop-blur-md border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-lg font-bold text-white leading-snug">{training.formationTitre}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                    training.disponibles > 5 
                      ? 'bg-green-500/20 text-green-400' 
                      : training.disponibles > 0 
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {training.disponibles > 0 ? `${training.disponibles} places` : 'Complet'}
                  </span>
                </div>
                
                <div className="space-y-2.5 text-sm text-orange-100/70">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    {training.lieu}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                    {training.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                    {training.duree}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500 shrink-0" />
                    {training.places} participants max
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(training)}
                disabled={training.disponibles === 0}
                className={`w-full mt-6 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                  training.disponibles > 0
                    ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-600/10'
                    : 'bg-white/5 text-orange-200/20 border border-white/5 cursor-not-allowed'
                }`}
              >
                {training.disponibles > 0 ? (
                  <>
                    S'inscrire
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  'Complet'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Modal d'inscription */}
        {showForm && selectedTraining && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Inscription</h3>
                  <p className="text-sm text-orange-400 font-semibold mt-1">{selectedTraining.formationTitre}</p>
                  <p className="text-xs text-orange-200/50 mt-0.5">{selectedTraining.lieu} - {selectedTraining.date}</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-orange-200/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ex: +229 01 29 23 91 94"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-100 mb-2">
                      Pays *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                      value={formData.pays}
                      onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                      placeholder="ex: Bénin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-100 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      placeholder="ex: Cotonou"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="ex: SIB (Optionnel)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Précisez vos besoins..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-500 disabled:bg-orange-600/50 disabled:cursor-not-allowed transition-colors mt-4"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      S'inscrire via WhatsApp
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