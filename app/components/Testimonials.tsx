"use client"

import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Marie Kouassi',
      role: 'Directrice RH, Groupe SIB',
      text: "Grâce à ConseiluxTraining, nous avons certifié 50 collaborateurs en gestion de projet. Un accompagnement professionnel et des résultats exceptionnels.",
      rating: 5
    },
    {
      name: 'Jean Adé',
      role: 'CEO, Tech Solutions Africa',
      text: "La formation en cybersécurité a transformé notre approche de la sécurité. Nos équipes sont désormais certifiées et opérationnelles.",
      rating: 5
    },
    {
      name: 'Fatima Diallo',
      role: 'Responsable Formation, Groupe BIA',
      text: "Un partenaire de confiance qui comprend nos enjeux. Les formations TOEIC ont permis à nos équipes d'atteindre leurs objectifs.",
      rating: 5
    },
  ]

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title text-orange-100">Ce que disent nos clients</h2>
          <p className="section-subtitle text-orange-200">
            Des entreprises qui nous font confiance pour former et développer leurs équipes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-xl shadow-black/10">
              <div className="flex text-orange-300 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-orange-100 mb-4 italic">&quot;{testimonial.text}&quot;</p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-orange-200">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}