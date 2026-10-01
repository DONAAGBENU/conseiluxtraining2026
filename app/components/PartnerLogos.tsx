"use client"

import Image from 'next/image'
import { useLanguage } from './LanguageProvider'

const partnerImages = [
  '/images/partenaire1.jpeg',
  '/images/partenaire2.jpeg',
  '/images/partenaire3.jpeg',
  '/images/partenaire4.jpeg',
  '/images/partenaire5.jpeg',
  '/images/partenaire6.jpeg',
  '/images/partenaire7.jpeg',
  '/images/partenaire8.jpeg',
  '/images/partenaire9.jpeg',
  '/images/partenaire10.jpeg'
]

export default function PartnerLogos() {
  const { language } = useLanguage()
  const duplicatedImages = [...partnerImages, ...partnerImages, ...partnerImages]

  return (
    <div className="border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      <div className="container mx-auto px-4 py-5">
        <h3 className="text-center text-lg md:text-xl font-bold text-slate-900 dark:text-white">{language === 'fr' ? 'Nos Partenaires' : 'Our Partners'}</h3>
      </div>

      <div className="overflow-hidden w-full pb-6">
        <div className="flex gap-2 md:gap-4 lg:gap-6 xl:gap-8 animate-scroll group-hover:pause min-w-max">
          {duplicatedImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="flex-shrink-0 w-12 h-10 sm:w-14 sm:h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 xl:w-32 xl:h-20 bg-white dark:bg-slate-800 rounded-lg p-1 md:p-2 flex items-center justify-center border border-slate-200 dark:border-white/10 hover:border-orange-500/30 transition-all group"
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