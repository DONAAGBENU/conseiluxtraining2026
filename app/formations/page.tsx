"use client"

import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Link from 'next/link'
import { ChevronRight, Clock, Loader2 } from 'lucide-react'

export default function FormationsList() {
  const [formations, setFormations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        setFormations(data.formations || [])
      })
      .catch(err => {
        console.error('Erreur lors du chargement des formations:', err)
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
            <h1 className="text-4xl md:text-5xl font-bold">Nos Formations</h1>
            <p className="text-xl text-orange-100 mt-4">
              Découvrez l'ensemble de nos programmes de formation
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[30vh]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              </div>
            ) : formations.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-orange-200/60">Aucune formation disponible pour le moment. Revenez bientôt !</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formations.map((formation) => (
                  <Link 
                    key={formation.id} 
                    href={`/formations/${formation.id}`}
                    className="card border-t-4 border-primary hover:-translate-y-2 transition-all bg-white/10 backdrop-blur-md border-white/10"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{formation.titre}</h3>
                    <p className="text-sm text-orange-400 mb-2">{formation.categorie}</p>
                    <p className="text-orange-200/70 text-sm">{formation.description.slice(0, 100)}...</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-orange-200/50 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formation.duree}
                      </span>
                      <span className="text-orange-500 font-medium text-sm flex items-center gap-1">
                        Voir plus <ChevronRight className="w-4 h-4" />
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