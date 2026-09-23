"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from './LanguageProvider'

const oldPartnerImages = [
  '/images/Ecobank.jpeg',
  '/images/MHA.jpeg',
  '/images/SOCIETE GENERAL.jpeg',
  '/images/bank of Africa.jpeg',
  '/images/banque Atlantique.jpeg',
  '/images/caterpillar.jpeg',
  '/images/cimco.jpeg',
  '/images/coris bank.jpeg',
  '/images/coris messo finance.jpeg',
  '/images/ieng.jpeg',
  '/images/ofmas.jpeg',
  '/images/orabank.jpeg',
  '/images/plan international.jpeg',
  '/images/sogemef.jpeg',
  '/images/sonibank.jpeg'
]

export default function PartnersSlider() {
  const { t } = useLanguage()
  const [duplicatedImages, setDuplicatedImages] = useState<string[]>([])

  useEffect(() => {
    // Duplicate images for infinite scroll effect
    setDuplicatedImages([...oldPartnerImages, ...oldPartnerImages, ...oldPartnerImages])
  }, [])

  return (
    <div className="bg-transparent py-6 md:py-8">
      <div className="container mx-auto px-4 mb-4 md:mb-6">
        <h3 className="text-center text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">{t.partners.title}</h3>
        <p className="text-center text-slate-500 dark:text-slate-400 text-xs md:text-sm">{t.partners.subtitle}</p>
      </div>

      <div className="overflow-hidden w-full">
        <div className="flex gap-3 md:gap-5 animate-scroll group-hover:pause min-w-max">
          {duplicatedImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="flex-shrink-0 w-24 h-16 sm:w-28 sm:h-18 md:w-32 md:h-20 bg-white dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700/80 hover:border-orange-500/40 shadow-xs transition-all"
            >
              <Image
                src={image}
                alt={`Partner ${index + 1}`}
                width={120}
                height={60}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
