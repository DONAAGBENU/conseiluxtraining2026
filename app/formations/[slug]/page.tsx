"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { CheckCircle, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function FormationDetail() {
  const params = useParams()
  const slug = params?.slug as string
  const [formation, setFormation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        const formations = data.formations || []
        const found = formations.find(
          (f: any) => f.id === slug || f.titre.toLowerCase().replace(/ /g, '-') === slug
        )
        setFormation(found || null)
      })
      .catch(err => console.error('Erreur chargement formation:', err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!formation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl text-orange-200/60">Formation non trouvée</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{formation.titre}</h1>
            <p className="text-xl text-orange-100 mt-4">{formation.categorie}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="card border-t-4 border-primary bg-white/10 backdrop-blur-md border-white/10">
              <p className="text-orange-100/90 text-lg">{formation.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <Clock className="w-6 h-6 text-orange-500 mx-auto" />
                  <p className="text-sm text-orange-200/80 mt-1">{formation.duree}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-2xl">💰</span>
                  <p className="text-sm text-orange-200/80 mt-1">{formation.prix}</p>
                </div>
                {formation.certifiante && (
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    <p className="text-sm text-green-400 mt-1">Certifiante</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-white mb-3">Modules de formation</h3>
                <ul className="space-y-2">
                  {formation.modules.map((module: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-orange-100/90">{module}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href="/contact"
                className="mt-8 inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/10"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}