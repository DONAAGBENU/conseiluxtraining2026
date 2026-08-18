"use client"

import Link from 'next/link'
import { FileText, Phone, CheckCircle, Award, Users, TrendingUp } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useState, useEffect, useRef } from 'react'

const heroImage = "https://plus.unsplash.com/premium_photo-1661490222612-f6702049e9d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export default function Hero() {
  const { t, language } = useLanguage()
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [displayedSubtitle, setDisplayedSubtitle] = useState('')
  const [titleDone, setTitleDone] = useState(false)
  const [subtitleDone, setSubtitleDone] = useState(false)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fullTitle = 'Conseilux Training & Development'
  const fullSubtitle = language === 'fr'
    ? 'Partenaire stratégique en formation & conseil'
    : 'Strategic partner in training & consulting'

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
            animRef.current = setTimeout(typeSub, 24)
          } else {
            setSubtitleDone(true)
          }
        }
        animRef.current = setTimeout(typeSub, 100)
      }
    }
    animRef.current = setTimeout(typeTitle, 150)
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [language, fullSubtitle])

  return (
    <section
      className="relative flex flex-col justify-center text-white overflow-hidden"
      style={{ height: 'calc(100svh - 88px)', minHeight: '500px' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-slate-900/85 to-orange-950/65" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
          backgroundSize: '44px 44px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-12 xl:px-16 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

          {/* ── LEFT ── */}
          <div className="flex flex-col items-start">

            {/* Badge — hidden on very small screens */}
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full mb-3 text-orange-200 text-xs font-medium">
              🚀 {language === 'fr' ? 'Cabinet de conseil & formation' : 'Consulting & Training Firm'}
            </div>

            {/* Animated title */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold mb-2 leading-snug"
              style={{ minHeight: '2rem' }}
            >
              <span className="bg-gradient-to-r from-orange-200 via-white to-orange-300 bg-clip-text text-transparent">
                {displayedTitle}
              </span>
              {!titleDone && (
                <span className="inline-block w-[3px] h-[0.8em] bg-orange-400 ml-1 align-middle animate-blink" />
              )}
            </h1>

            {/* Animated subtitle */}
            <p
              className="text-sm sm:text-base md:text-lg text-orange-100/85 mb-3 leading-snug"
              style={{ minHeight: '1.4rem' }}
            >
              {displayedSubtitle}
              {titleDone && !subtitleDone && (
                <span className="inline-block w-[2px] h-[1em] bg-orange-300 ml-0.5 align-middle animate-blink" />
              )}
            </p>

            {/* Services line — hidden on small mobile */}
            <p className="hidden sm:block text-xs text-orange-200/50 mb-4">
              {language === 'fr'
                ? 'Conseil • Formation • Recrutement • Accompagnement'
                : 'Consulting • Training • Recruitment • Support'}
            </p>

            {/* ── CTA BUTTONS ── */}
            <div className="flex flex-row gap-2 mb-4 flex-wrap">
              <Link
                href="/catalogue"
                id="hero-catalogue-btn"
                className="group relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm overflow-hidden shadow-lg shadow-orange-600/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%)' }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                <FileText className="w-4 h-4 shrink-0" />
                <span>{t.nav.downloadCatalogue}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse shrink-0" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/10 hover:border-white/55 transition-all duration-300 whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                {language === 'fr' ? 'Contacter' : 'Contact'}
              </Link>
            </div>

            {/* Stats — hidden on mobile, shown from sm */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {[
                { icon: <Award className="w-3.5 h-3.5" />, value: '130+', label: language === 'fr' ? 'Certifications' : 'Certifications' },
                { icon: <Users className="w-3.5 h-3.5" />, value: '75%', label: language === 'fr' ? 'Réussite' : 'Success' },
                { icon: <TrendingUp className="w-3.5 h-3.5" />, value: '15+', label: language === 'fr' ? 'Années' : 'Years' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5">
                  <div className="text-orange-400">{stat.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-orange-100 leading-none">{stat.value}</div>
                    <div className="text-[9px] text-orange-200/50 mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — feature cards (desktop only) ── */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {[
              { Icon: CheckCircle, titleFr: 'Conseil Stratégique', titleEn: 'Strategic Consulting', descFr: 'Diagnostic, audit, stratégie', descEn: 'Diagnostic, audit, strategy' },
              { Icon: Award, titleFr: 'Certifications', titleEn: 'Certifications', descFr: 'PMP, ITIL, TOEIC, ISO...', descEn: 'PMP, ITIL, TOEIC, ISO...' },
              { Icon: Users, titleFr: 'Recrutement', titleEn: 'Recruitment', descFr: 'Talents sur mesure', descEn: 'Custom talent sourcing' },
              { Icon: TrendingUp, titleFr: 'Accompagnement', titleEn: 'Field Support', descFr: 'Ventes & développement', descEn: 'Sales & development' },
            ].map(({ Icon, titleFr, titleEn, descFr, descEn }, i) => (
              <div
                key={i}
                className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className="text-orange-400 w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-0.5 text-sm">{language === 'fr' ? titleFr : titleEn}</h3>
                <p className="text-xs text-orange-200/55">{language === 'fr' ? descFr : descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-25 animate-bounce">
        <div className="w-px h-5 bg-white/50" />
      </div>

      <style jsx>{`
        .animate-blink {
          animation: blink 0.65s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}