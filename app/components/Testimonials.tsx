"use client"

import { Star } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

export default function Testimonials() {
  const { t, language } = useLanguage()

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
    <section className="py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2 block">
            {language === 'fr' ? 'Retours d\'expérience' : 'Client Feedback'}
          </span>
          <h2 className="section-title">{t.testimonials.title}</h2>
          <p className="section-subtitle">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-400 mb-4 gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-sm shrink-0">
                  {testimonial.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{testimonial.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}