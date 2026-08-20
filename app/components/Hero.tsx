"use client"

import Link from 'next/link'
import { FileText, Phone, CheckCircle, Award, Users, TrendingUp } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useState, useEffect, useRef } from 'react'

const heroImages = [
  '/images/hero1.jpeg',
  '/images/hero2.jpeg',
  '/images/hero3.jpeg',
  '/images/hero4.jpeg',
  '/images/hero5.jpeg'
]

export default function Hero() {
  const { t, language } = useLanguage()
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [displayedSubtitle, setDisplayedSubtitle] = useState('')
  const [titleDone, setTitleDone] = useState(false)
  const [subtitleDone, setSubtitleDone] = useState(false)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const fullTitle = 'Conseilux Training & Development'
  const fullSubtitle = language === 'fr'
    ? 'Votre partenaire stratégique pour développer la performance durable'
    : 'Your strategic partner for sustainable performance development'

  // Typewriter — proprement nettoyé à chaque changement de langue ou démontage
  useEffect(() => {
    if (animRef.current) clearTimeout(animRef.current)
    setDisplayedTitle('')
    setDisplayedSubtitle('')
    setTitleDone(false)
    setSubtitleDone(false)

    let ti = 0
    const typeTitle = () => {
      if (ti < fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, ti + 1))
        ti++
        animRef.current = setTimeout(typeTitle, 48)
      } else {
        setTitleDone(true)
        let si = 0
        const typeSub = () => {
          if (si < fullSubtitle.length) {
            setDisplayedSubtitle(fullSubtitle.slice(0, si + 1))
            si++
            animRef.current = setTimeout(typeSub, 22)
          } else {
            setSubtitleDone(true)
          }
        }
        animRef.current = setTimeout(typeSub, 80)
      }
    }
    animRef.current = setTimeout(typeTitle, 200)
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [language, fullSubtitle])

  // Image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { icon: <Award className="w-6 h-6" />, value: '130+', label: language === 'fr' ? 'Certifications déployées' : 'Certifications Deployed' },
    { icon: <Users className="w-6 h-6" />, value: '75%', label: language === 'fr' ? 'Taux de réussite' : 'Success Rate' },
    { icon: <TrendingUp className="w-6 h-6" />, value: '15+', label: language === 'fr' ? "Années d'expertise" : 'Years of Expertise' },
  ]

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] overflow-hidden text-white bg-transparent">
      {/* Background slideshow */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-slate-950/20" />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="w-full">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-6">
              <span className="text-xs md:text-sm font-medium">🚀 {language === 'fr' ? 'Cabinet de conseil & formation' : 'Consulting & Training Firm'}</span>
            </div>

            {/* Animated title */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white" style={{ minHeight: '60px', width: '100%', maxWidth: '600px', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              <span className="text-white">{displayedTitle}</span>
              {!subtitleDone && (
                <span
                  className="inline-block w-[3px] h-[0.85em] bg-orange-500 ml-1 align-middle"
                  style={{ animation: 'blink 0.7s step-end infinite' }}
                />
              )}
            </h1>

            {/* Animated subtitle */}
            <p className="text-base md:text-xl lg:text-2xl mb-3 md:mb-4 text-white" style={{ minHeight: '50px', width: '100%', maxWidth: '600px', textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
              {displayedSubtitle}
              {titleDone && !subtitleDone && (
                <span
                  className="inline-block w-[2px] h-[1em] bg-orange-500 ml-0.5 align-middle"
                  style={{ animation: 'blink 0.7s step-end infinite' }}
                />
              )}
            </p>

            <p className="text-sm md:text-lg text-white/90 mb-6 md:mb-8" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
              {language === 'fr'
                ? 'Conseil stratégique • Formation • Recrutement • Accompagnement commercial terrain'
                : 'Strategic Consulting • Training • Recruitment • Commercial Field Support'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center gap-2 bg-orange-800 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-orange-900 transition-colors text-base md:text-lg"
              >
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                {t.nav.downloadCatalogue}
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-orange-800 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-orange-800 hover:text-white transition-colors text-base md:text-lg"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                {language === 'fr' ? 'Nous contacter' : 'Contact Us'}
              </Link>
            </div>

            <div className="mt-6 md:mt-8 flex flex-wrap gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2 md:gap-3">
                  <div className="text-orange-500 w-5 h-5 md:w-6 md:h-6">{stat.icon}</div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs md:text-sm text-white/90">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <CheckCircle className="text-orange-500 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Conseil Stratégique' : 'Strategic Consulting'}</h3>
                <p className="text-sm text-white/90">{language === 'fr' ? 'Diagnostic, audit, stratégie' : 'Diagnostic, audit, strategy'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Award className="text-orange-500 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Certifications' : 'Certifications'}</h3>
                <p className="text-sm text-white/90">PMP, ITIL, TOEIC, ISO...</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Users className="text-orange-500 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Recrutement' : 'Recruitment'}</h3>
                <p className="text-sm text-white/90">{language === 'fr' ? 'Talents sur mesure' : 'Custom talents'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <TrendingUp className="text-orange-500 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Accompagnement' : 'Support'}</h3>
                <p className="text-sm text-white/90">{language === 'fr' ? 'Ventes & développement' : 'Sales & development'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}