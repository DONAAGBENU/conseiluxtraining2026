"use client"

import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, ChevronRight, Send } from 'lucide-react'

interface Training {
  id: number
  title: string
  location: string
  date: string
  duration: string
  seats: number
  available: number
}

export default function TrainingDates() {
  const [showForm, setShowForm] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  })

  const trainings: Training[] = [
    {
      id: 1,
      title: 'Gestion de Projet - PMP',
      location: 'Cotonou, Bénin',
      date: '15-19 Septembre 2024',
      duration: '5 jours',
      seats: 15,
      available: 8
    },
    {
      id: 2,
      title: 'Cybersécurité - CISSP',
      location: 'Lomé, Togo',
      date: '22-26 Septembre 2024',
      duration: '5 jours',
      seats: 12,
      available: 5
    },
    {
      id: 3,
      title: 'TOEIC - Préparation Intensive',
      location: 'Abidjan, Côte d\'Ivoire',
      date: '01-05 Octobre 2024',
      duration: '5 jours',
      seats: 20,
      available: 12
    },
    {
      id: 4,
      title: 'Management & Leadership',
      location: 'Niamey, Niger',
      date: '07-09 Octobre 2024',
      duration: '3 jours',
      seats: 15,
      available: 10
    },
    {
      id: 5,
      title: 'Power BI & Data Analytics',
      location: 'Paris, France',
      date: '14-18 Octobre 2024',
      duration: '5 jours',
      seats: 10,
      available: 4
    },
    {
      id: 6,
      title: 'Lean Six Sigma - Green Belt',
      location: 'Cotonou, Bénin',
      date: '21-25 Octobre 2024',
      duration: '5 jours',
      seats: 12,
      available: 7
    },
  ]

  const handleSubscribe = (training: Training) => {
    setSelectedTraining(training)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = `Bonjour, je souhaite m'inscrire à la formation : ${selectedTraining?.title}\n\nNom: ${formData.name}\nTéléphone: ${formData.phone}\nEmail: ${formData.email}\nEntreprise: ${formData.company}\n\n${formData.message}`
    const phoneNumber = '+2290129239194'
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
    setShowForm(false)
    setFormData({ name: '', phone: '', email: '', company: '', message: '' })
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Dates de Formation</h2>
          <p className="section-subtitle">
            Inscrivez-vous dès maintenant à nos prochaines sessions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <div key={training.id} className="card border-t-4 border-orange-600 hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-slate-900">{training.title}</h3>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  {training.available} places
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  {training.location}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  {training.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  {training.duration}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  {training.seats} participants max
                </p>
              </div>

              <button
                onClick={() => handleSubscribe(training)}
                className="w-full mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                S'inscrire
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal d'inscription */}
        {showForm && selectedTraining && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border-t-4 border-orange-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Inscription</h3>
                  <p className="text-sm text-orange-600 font-medium">{selectedTraining.title}</p>
                  <p className="text-sm text-gray-500">{selectedTraining.location} - {selectedTraining.date}</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Envoyer via WhatsApp
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}