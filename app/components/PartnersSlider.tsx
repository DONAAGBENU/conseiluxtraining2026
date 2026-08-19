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
        <h3 className="text-center text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t.partners.title}</h3>
        <p className="text-center text-orange-500/60 text-xs md:text-sm">{t.partners.subtitle}</p>
      </div>
      
      <div className="overflow-hidden w-full">
        <div className="flex gap-2 md:gap-4 lg:gap-6 xl:gap-8 animate-scroll group-hover:pause min-w-max">
          {duplicatedImages.map((image, index) => (
            <div 
              key={`${image}-${index}`} 
              className="flex-shrink-0 w-12 h-10 sm:w-14 sm:h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 xl:w-32 xl:h-20 bg-white/10 rounded-lg p-1 md:p-2 flex items-center justify-center border border-white/10 hover:border-orange-500/30 transition-all group"
            >
              <Image
                src={image}
                alt={`Partner ${index + 1}`}
                width={120}
                height={60}
                className="object-contain w-auto h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
