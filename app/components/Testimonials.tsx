"use client"

import { Star } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

export default function Testimonials() {
  const { t } = useLanguage()

  const testimonials = [
    {
      name: 'Marie Kouassi',
      role: t.testimonials.marieRole,
      text: t.testimonials.marieText,
      rating: 5
    },
    {
      name: 'Jean Adé',
      role: t.testimonials.jeanRole,
      text: t.testimonials.jeanText,
      rating: 5
    },
    {
      name: 'Fatima Diallo',
      role: t.testimonials.fatimaRole,
      text: t.testimonials.fatimaText,
      rating: 5
    },
  ]

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title text-orange-100">{t.testimonials.title}</h2>
          <p className="section-subtitle text-orange-200">
            {t.testimonials.subtitle}
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