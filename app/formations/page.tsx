"use client"

import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Link from 'next/link'
import { ChevronRight, Clock, Loader2 } from 'lucide-react'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function FormationsList() {
  const { t, language } = useLanguage()
  const [formations, setFormations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        setFormations(data.formations || [])
      })
      .catch(err => {
        console.error(language === 'fr' ? 'Erreur lors du chargement des formations:' : 'Error loading trainings:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{t.formations.title}</h1>
            <p className="text-xl text-white/90 mt-4">
              {t.formations.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[30vh]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-800" />
              </div>
            ) : formations.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-white/60">{t.formations.noFormations}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formations.map((formation) => (
                  <Link
                    key={formation.id}
                    href={`/formations/${formation.id}`}
                    className="card border-t-4 border-primary hover:-translate-y-2 transition-all bg-white/10 backdrop-blur-md border-white/10"
                  >
                    <h3 className="text-xl font-bold text-white mb-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{formation.titre}</h3>
                    <p className="text-sm text-white mb-2">{formation.categorie}</p>
                    <p className="text-white/70 text-sm">{formation.description.slice(0, 100)}...</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-white/50 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formation.duree}
                      </span>
                      <span className="text-white font-medium text-sm flex items-center gap-1">
                        {t.formations.viewMore} <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}