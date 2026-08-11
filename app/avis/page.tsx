'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Star, Calendar, MessageSquare, Loader2 } from 'lucide-react'

interface Testimonial {
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

export default function Avis() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApprovedAvis()
  }, [])

  const fetchApprovedAvis = async () => {
    try {
      const res = await fetch('/api/avis?approved=true')
      const data = await res.json()
      setTestimonials(data.avis || [])
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Avis Clients</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Ce que nos clients disent de leurs expériences avec ConseiluxTraining
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[30vh]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl max-w-xl mx-auto">
                <MessageSquare className="w-16 h-16 text-orange-200/20 mx-auto mb-4" />
                <p className="text-orange-200/60 font-medium">Aucun avis publié pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="card border-t-4 border-orange-600 hover:-translate-y-1 transition-all bg-white/10 backdrop-blur-md border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex text-orange-400 mb-3">
                        {[...Array(testimonial.note)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-orange-100/90 mb-6 italic text-sm font-light leading-relaxed">
                        &quot;{testimonial.texte}&quot;
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600/20 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-base">
                          {testimonial.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{testimonial.nom}</p>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-orange-200/60 mt-0.5">
                            <span>{testimonial.role}</span>
                            {testimonial.role && testimonial.entreprise && <span>•</span>}
                            <span>{testimonial.entreprise}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-orange-200/40 mt-3 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {testimonial.date}
                      </p>
                    </div>
                  </div>
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