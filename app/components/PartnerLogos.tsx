"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from './LanguageProvider'

const partnerImages = [
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

export default function PartnerLogos() {
  const { t } = useLanguage()
  const [duplicatedImages, setDuplicatedImages] = useState<string[]>([])

  useEffect(() => {
    // Duplicate images for infinite scroll effect
    setDuplicatedImages([...partnerImages, ...partnerImages, ...partnerImages])
  }, [])

  return (
    <div className="bg-slate-900/50 py-8 border-t border-white/5">
      <div className="container mx-auto px-4 mb-6">
        <h3 className="text-center text-xl font-bold text-white mb-2">{t.partnerLogos.title}</h3>
        <p className="text-center text-orange-800/60 text-sm">{t.partnerLogos.subtitle}</p>
      </div>
      
      <div className="overflow-hidden w-full">
        <div className="flex gap-2 md:gap-6 lg:gap-8 animate-scroll group-hover:pause min-w-max">
          {duplicatedImages.map((image, index) => (
            <div 
              key={`${image}-${index}`} 
              className="flex-shrink-0 w-16 h-12 md:w-24 md:h-16 lg:w-32 lg:h-20 bg-white/10 rounded-lg p-1 md:p-2 flex items-center justify-center border border-white/10 hover:border-orange-800/30 transition-all group"
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