"use client"

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Hero from '@/app/components/Hero'
import Partners from '@/app/components/Partners'
import Testimonials from '@/app/components/Testimonials'

import TrainingDates from '@/app/components/TrainingDates'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from './components/LanguageProvider'
import { 
  Award, Users, Target, BookOpen, CheckCircle, Clock, 
  GraduationCap, Globe, FileText, BarChart, ChevronRight,
  Server, Projector, Users2, Briefcase, TrendingUp, Languages,
  Handshake, Sparkles
} from 'lucide-react'

export default function Home() {
  const { t, language } = useLanguage()
  const domains = [
    {
      icon: <Server className="w-8 h-8" />,
      title: t.categories.technology,
      description: 'IA, Cloud Computing, Cybersécurité CISSP, ISO 27001, Réseaux',
      href: '/formations/technologies-numeriques',
    },
    {
      icon: <Projector className="w-8 h-8" />,
      title: t.categories.projectManagement,
      description: 'PMP® PMI, PRINCE2®, Scrum Master, Agile & Kanban',
      href: '/formations/gestion-projet',
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: t.categories.management,
      description: 'Leadership situationnel, Stratégie RH, Conduite du changement',
      href: '/formations/management-leadership',
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: t.categories.careers,
      description: 'Audit financier, Contrôle de gestion, Logistique, Supply Chain',
      href: '/formations/filieres-metiers',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t.categories.commercial,
      description: 'Négociation B2B complexe, Prospection grands comptes, Vente consultative',
      href: '/formations/performance-commerciale',
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: t.categories.languages,
      description: 'Anglais des affaires, Préparation certifiante TOEIC® & TOEFL®',
      href: '/formations/langues',
    },
  ]

  const values = [
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: t.home.valueEthics,
      description: t.home.valueEthicsDesc
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: t.home.valueProximity,
      description: t.home.valueProximityDesc
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: t.home.valueExcellence,
      description: t.home.valueExcellenceDesc
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: t.home.valueInnovation,
      description: t.home.valueInnovationDesc
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-200">
      <Header />

      <main className="flex-grow">
        <Hero />
        
        {/* Partenaires */}
        <section className="py-2 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
          <Partners />
        </section>

        {/* Domaines de formation */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2 block">
                {language === 'fr' ? 'Nos Pôles d\'Expertise' : 'Areas of Expertise'}
              </span>
              <h2 className="section-title">{t.home.domainsTitle}</h2>
              <p className="section-subtitle">
                {t.home.domainsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domains.map((domain, index) => (
                <Link
                  key={index}
                  href={domain.href}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      {domain.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2">
                      {domain.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                      {domain.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-orange-600 dark:text-orange-400">
                    <span>{t.home.seeFormations}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2 block">
                {language === 'fr' ? 'Notre ADN' : 'Our DNA'}
              </span>
              <h2 className="section-title">{t.home.valuesTitle}</h2>
              <p className="section-subtitle">
                {t.home.valuesSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 text-center shadow-xs hover:shadow-md transition-all">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-50 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 rounded-2xl text-orange-600 dark:text-orange-400 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions & Accompagnement */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-3xl p-8 md:p-14 shadow-xl">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-2 block">
                  {language === 'fr' ? 'Approche Globale' : 'Holistic Approach'}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
                  {t.home.solutionsTitle}
                </h2>
                <p className="text-sm md:text-base text-orange-100/90 leading-relaxed">
                  {t.home.solutionsSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-xl bg-white/20">
                    <Image
                      src="/images/conseil.jpeg"
                      alt="Conseil"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-white tracking-wide">{language === 'fr' ? 'Conseil Stratégique' : 'Consulting'}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-xl bg-white/20">
                    <Image
                      src="/images/formation.jpeg"
                      alt="Formation"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-white tracking-wide">{language === 'fr' ? 'Formation Certifiante' : 'Training'}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-xl bg-white/20">
                    <Image
                      src="/images/recrutement.jpeg"
                      alt="Recrutement"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-white tracking-wide">{language === 'fr' ? 'Recrutement & Chasse' : 'Recruitment'}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-xl bg-white/20">
                    <Image
                      src="/images/accompagnement.jpeg"
                      alt="Accompagnement"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-white tracking-wide">{language === 'fr' ? 'Accompagnement RH' : 'Support'}</p>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/nos-solutions"
                  className="inline-flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 px-7 py-3 rounded-xl font-bold text-sm shadow-lg shadow-black/10 transition-all hover:gap-3"
                >
                  <span>{t.home.discoverSolutions}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dates de formation */}
        <TrainingDates />

        {/* Témoignages */}
        <Testimonials />

        {/* CTA Prêt à démarrer */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-10 md:p-14 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{t.home.readyTitle}</h2>
              <p className="text-sm md:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                {t.home.readySubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="bg-orange-600 hover:bg-orange-500 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md shadow-orange-600/20 transition-all"
                >
                  {t.home.contactUs}
                </Link>
                <Link
                  href="/catalogue"
                  className="border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-7 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  {t.home.downloadCatalog}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}