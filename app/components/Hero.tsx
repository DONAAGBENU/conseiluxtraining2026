"use client"

import Link from 'next/link'
import { FileText, Phone, CheckCircle, Award, Users, TrendingUp, ArrowRight, Sparkles, Target, Zap } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useState, useEffect } from 'react'

const heroImage = "https://plus.unsplash.com/premium_photo-1661490222612-f6702049e9d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export default function Hero() {
  const { t, language } = useLanguage()
  const [animatedTitle, setAnimatedTitle] = useState('')
  const [animatedSubtitle, setAnimatedSubtitle] = useState('')
  
  const fullTitle = language === 'fr' ? 'Conseilux Training and Development' : 'Conseilux Training and Development'
  const fullSubtitle = language === 'fr' ? 'Votre partenaire stratégique pour développer la performance durable' : 'Your strategic partner for sustainable performance development'
  
  useEffect(() => {
    const animateText = () => {
      // Reset animation when language changes
      setAnimatedTitle('')
      setAnimatedSubtitle('')
      
      let titleIndex = 0
      const titleInterval = setInterval(() => {
        if (titleIndex < fullTitle.length) {
          setAnimatedTitle(fullTitle.slice(0, titleIndex + 1))
          titleIndex++
        } else {
          clearInterval(titleInterval)
          
          // Start subtitle animation after title completes
          let subtitleIndex = 0
          const subtitleInterval = setInterval(() => {
            if (subtitleIndex < fullSubtitle.length) {
              setAnimatedSubtitle(fullSubtitle.slice(0, subtitleIndex + 1))
              subtitleIndex++
            } else {
              clearInterval(subtitleInterval)
            }
          }, 30)
          
          return () => clearInterval(subtitleInterval)
        }
      }, 50)
      
      return () => clearInterval(titleInterval)
    }
    
    // Animation initiale
    animateText()
    
    // Rejouer l'animation toutes les 10 secondes
    const repeatInterval = setInterval(() => {
      animateText()
    }, 10000)
    
    return () => clearInterval(repeatInterval)
  }, [language, fullTitle, fullSubtitle])
  
  const stats = [
    { icon: <Award className="w-6 h-6" />, value: '130+', label: language === 'fr' ? 'Certifications déployées' : 'Certifications Deployed' },
    { icon: <Users className="w-6 h-6" />, value: '75%', label: language === 'fr' ? 'Taux de réussite' : 'Success Rate' },
    { icon: <TrendingUp className="w-6 h-6" />, value: '15+', label: language === 'fr' ? "Années d'expertise" : 'Years of Expertise' },
  ]

  return (
    <section className="relative min-h-[70vh] overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-slate-950/80" />

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-medium">🚀 {language === 'fr' ? 'Cabinet de conseil & formation' : 'Consulting & Training Firm'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-orange-100" style={{ minHeight: '80px' }}>
              <span className="text-orange-200">{animatedTitle}</span>
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-orange-100" style={{ minHeight: '60px' }}>
              {animatedSubtitle}
            </p>
            <p className="text-lg text-orange-200/80 mb-8">
              {language === 'fr' ? 'Conseil stratégique • Formation • Recrutement • Accompagnement commercial terrain' : 'Strategic Consulting • Training • Recruitment • Commercial Field Support'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/*
                ✅ Redirige vers /catalogue (page formulaire)
                Le PDF se télécharge automatiquement APRÈS soumission du formulaire
                Flux : Hero → /catalogue (formulaire) → PDF téléchargé
              */}
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-lg"
              >
                <FileText className="w-5 h-5" />
                {t.nav.downloadCatalogue}
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors text-lg"
              >
                <Phone className="w-5 h-5" />
                {language === 'fr' ? 'Nous contacter' : 'Contact Us'}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-orange-200">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-orange-100">{stat.value}</div>
                    <div className="text-sm text-orange-200">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <CheckCircle className="text-orange-200 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Conseil Stratégique' : 'Strategic Consulting'}</h3>
                <p className="text-sm text-orange-200">{language === 'fr' ? 'Diagnostic, audit, stratégie' : 'Diagnostic, audit, strategy'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Award className="text-orange-200 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Certifications' : 'Certifications'}</h3>
                <p className="text-sm text-orange-200">PMP, ITIL, TOEIC, ISO...</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Users className="text-orange-200 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Recrutement' : 'Recruitment'}</h3>
                <p className="text-sm text-orange-200">{language === 'fr' ? 'Talents sur mesure' : 'Custom talents'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <TrendingUp className="text-orange-200 w-8 h-8 mb-3" />
                <h3 className="font-semibold text-white mb-1">{language === 'fr' ? 'Accompagnement' : 'Support'}</h3>
                <p className="text-sm text-orange-200">{language === 'fr' ? 'Ventes & développement' : 'Sales & development'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}