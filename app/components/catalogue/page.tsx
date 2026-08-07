"use client"

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

import { FileText, Download, Send, CheckCircle } from 'lucide-react'

export default function Catalogue() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulaire catalogue:', formData)
    setSubmitted(true)
    // window.open('/catalogue-2026-2027.pdf', '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Catalogue 2026-2027</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Découvrez l'ensemble de nos formations et solutions
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="card border-t-4 border-orange-600">
              <div className="text-center mb-8">
                <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">Téléchargez le Catalogue</h2>
                <p className="text-gray-600">
                  Remplissez le formulaire pour recevoir notre catalogue complet
                </p>
              </div>

              {!submitted ? (
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
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Télécharger le catalogue
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Merci !</h3>
                  <p className="text-gray-600">
                    Votre demande a été enregistrée. Le téléchargement va commencer automatiquement.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}