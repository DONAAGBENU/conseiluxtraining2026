'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, MessageSquare } from 'lucide-react'
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
    } catch {
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-14 md:py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2 block">
              {language === 'fr' ? 'Parlons de vos projets' : 'Let\'s talk'}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t.contact.title}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.contact.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Formulaire */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-7 md:p-9 shadow-sm border-t-4 border-t-orange-600">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t.contact.sendMessage}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
                  {language === 'fr' ? 'Remplissez le formulaire et nous vous répondrons dans les plus brefs délais.' : 'Fill out the form and we will reply as soon as possible.'}
                </p>
                
                {success && (
                  <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">{t.contact.successMessage}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                      placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.contact.email} *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.contact.phone}
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                        placeholder="+228 90 00 00 00"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.contact.subject}
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
                      value={formData.sujet}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                    >
                      <option value="">{language === 'fr' ? 'Sélectionnez un sujet' : 'Select a subject'}</option>
                      <option value="formation">{language === 'fr' ? 'Demande de formation certifiante' : 'Certified training request'}</option>
                      <option value="conseil">{language === 'fr' ? 'Conseil stratégique & Audit' : 'Strategic consulting & Audit'}</option>
                      <option value="recrutement">{language === 'fr' ? 'Recrutement & Chasse de tête' : 'Recruitment'}</option>
                      <option value="catalogue">{language === 'fr' ? 'Téléchargement de catalogue' : 'Download catalog'}</option>
                      <option value="autre">{language === 'fr' ? 'Autre demande' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.contact.message} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                      placeholder={language === 'fr' ? 'Décrivez votre demande en quelques lignes...' : 'Describe your request...'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'fr' ? 'Envoi en cours...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contact.send}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Informations de contact */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-7 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <span>{t.contact.offices}</span>
                  </h3>
                  <div className="space-y-4">
                    {offices.map((office, index) => (
                      <div key={index} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-3 last:pb-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{office.city}, {office.country}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                          <Phone className="w-3.5 h-3.5 text-orange-600" />
                          <span>{office.phone}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{office.address}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-7 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {t.contact.generalInfo}
                  </h3>
                  <div className="space-y-3 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                    <p className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>contact@conseiluxtraining.com</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>{language === 'fr' ? 'Lundi - Vendredi : 8h00 - 18h00' : 'Monday - Friday: 8:00 AM - 6:00 PM'}</span>
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        📍 {language === 'fr' ? 'Présence internationale : Bénin, Togo, Côte d\'Ivoire, Niger, France' : 'International presence: Benin, Togo, Ivory Coast, Niger, France'}
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