'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function Contact() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        alert(language === 'fr' ? 'Erreur lors de l\'envoi du message' : 'Error sending message')
      }
    } catch (err) {
      alert(language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  const offices = [
    {
      city: 'Cotonou',
      country: 'Bénin',
      phone: '+229 01 29 23 91 94',
      address: 'Cotonou, Bénin'
    },
    {
      city: 'Lomé',
      country: 'Togo',
      phone: '+228 90 54 64 64',
      address: 'Lomé, Togo'
    },
    {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      phone: '+225 07 58 97 03 44',
      address: 'Abidjan, Côte d\'Ivoire'
    },
    {
      city: 'Niamey',
      country: 'Niger',
      phone: '+227 82 64 86 04',
      address: 'Niamey, Niger'
    },
    {
      city: 'Paris',
      country: 'France',
      phone: '+33 7 456 441 81',
      address: 'Paris, France'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{t.contact.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulaire */}
              <div className="card border-t-4 border-orange-800 bg-white/10 backdrop-blur-md border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{t.contact.sendMessage}</h2>
                
                {success && (
                  <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 text-sm font-medium">{t.contact.successMessage}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-black/35 text-white placeholder-white/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none"
                      placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {t.contact.email} *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 bg-black/35 text-white placeholder-white/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {t.contact.phone}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 bg-black/35 text-white placeholder-white/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none"
                      placeholder="+229 01 23 45 67"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {t.contact.subject}
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-black/35 text-white border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none [&>option]:bg-blue-900"
                      value={formData.sujet}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                    >
                      <option value="">{language === 'fr' ? 'Sélectionnez un sujet' : 'Select a subject'}</option>
                      <option value="formation">{language === 'fr' ? 'Demande de formation' : 'Training request'}</option>
                      <option value="conseil">{language === 'fr' ? 'Conseil stratégique' : 'Strategic consulting'}</option>
                      <option value="recrutement">{language === 'fr' ? 'Recrutement' : 'Recruitment'}</option>
                      <option value="catalogue">{language === 'fr' ? 'Télécharger catalogue' : 'Download catalog'}</option>
                      <option value="autre">{language === 'fr' ? 'Autre' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {t.contact.message} *
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full px-4 py-2 bg-black/35 text-white placeholder-white/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none"
                      placeholder={language === 'fr' ? 'Décrivez votre demande...' : 'Describe your request...'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-800 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:bg-orange-800/50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.contact.send}
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Informations de contact */}
              <div className="space-y-6">
                <div className="card border-t-4 border-orange-800 bg-white/10 backdrop-blur-md border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{t.contact.offices}</h3>
                  <div className="space-y-4">
                    {offices.map((office, index) => (
                      <div key={index} className="border-b border-white/10 last:border-0 pb-3 last:pb-0">
                        <h4 className="font-semibold text-white">{office.city}, {office.country}</h4>
                        <p className="text-sm text-white/80 flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-white" />
                          {office.phone}
                        </p>
                        <p className="text-sm text-white/80 flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-white" />
                          {office.address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card border-t-4 border-orange-800 bg-white/10 backdrop-blur-md border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{t.contact.generalInfo}</h3>
                  <div className="space-y-4">
                    <p className="flex items-center gap-3 text-sm text-white">
                      <Mail className="w-5 h-5 text-white flex-shrink-0" />
                      <span>contact@conseiluxtraining.com</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm text-white">
                      <Clock className="w-5 h-5 text-white flex-shrink-0" />
                      <span>{language === 'fr' ? 'Lundi - Vendredi : 8h00 - 18h00' : 'Monday - Friday: 8:00 AM - 6:00 PM'}</span>
                    </p>
                    <div className="mt-4 border-t border-white/5 pt-4">
                      <p className="text-sm text-white/90 font-medium">
                        {language === 'fr' ? '📍 Présence multi-pays : Bénin, Togo, Côte d\'Ivoire, Niger, France' : '📍 Multi-country presence: Benin, Togo, Ivory Coast, Niger, France'}
                      </p>
                    </div>
                  </div>
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