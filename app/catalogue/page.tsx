"use client"

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { FileText, Download, CheckCircle } from 'lucide-react'

export default function CataloguePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // window.open('/catalogue-2026-2027.pdf', '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Catalogue 2026-2027</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Découvrez l'ensemble de nos formations, certifications et solutions pour accélérer vos performances.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-10">
              <div className="text-center mb-10">
                <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-slate-900">Téléchargez le catalogue</h2>
                <p className="text-slate-600 mt-3">
                  Remplissez le formulaire pour recevoir notre brochure complète et découvrir nos offres.
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom et prénom *</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Entreprise</label>
                    <input
                      type="text"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Numéro de téléphone</label>
                    <input
                      type="tel"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Télécharger le catalogue
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Merci !</h3>
                  <p className="text-slate-600 max-w-xl mx-auto">
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
