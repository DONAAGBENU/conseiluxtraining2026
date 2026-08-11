"use client"

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Avis {
  id: string
  nom: string
  role: string
  entreprise: string
  texte: string
  note: number
  date: string
  logo: string
  approuve: boolean
}

export default function Partners() {
  const [avis, setAvis] = useState<Avis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/avis?approved=true')
      .then(res => res.json())
      .then(data => setAvis(data.avis || []))
      .catch(err => console.error('Erreur chargement avis:', err))
      .finally(() => setLoading(false))
  }, [])

  // Extraire les logos uniques des partenaires
  const partenaires = avis.reduce((acc, current) => {
    if (!acc.find(item => item.entreprise === current.entreprise)) {
      acc.push({
        entreprise: current.entreprise,
        logo: current.logo,
        avis: current.texte,
        nom: current.nom,
        note: current.note
      })
    }
    return acc
  }, [] as { entreprise: string; logo: string; avis: string; nom: string; note: number }[])

  // Ne rien afficher pendant le chargement ou si aucun partenaire
  if (loading || partenaires.length === 0) return null

  return (
    <section className="py-16 bg-transparent border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ils nous font confiance</h2>
          <p className="text-orange-200/60 max-w-2xl mx-auto">
            Des entreprises et organisations qui ont choisi ConseiluxTraining pour leur développement
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partenaires.map((partenaire, index) => (
            <div key={index} className="group">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {partenaire.logo ? (
                  <div className="w-full h-20 relative">
                    <img
                      src={partenaire.logo}
                      alt={partenaire.entreprise}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-20 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-400">
                      {partenaire.entreprise.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-white">{partenaire.entreprise}</p>
                  <div className="flex justify-center text-orange-400 mt-1">
                    {[...Array(partenaire.note)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-orange-200/30">
            * Les logos affichés correspondent aux entreprises ayant déposé un avis
          </p>
        </div>
      </div>
    </section>
  )
}