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
  Handshake
} from 'lucide-react'

export default function Home() {
  const { t, language } = useLanguage()
  const domains = [
    {
      icon: <Server className="w-10 h-10" />,
      title: t.categories.technology,
      description: 'IA, Cloud, Sécurité, Réseaux, Data',
      href: '/formations/technologies-numeriques',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Projector className="w-10 h-10" />,
      title: t.categories.projectManagement,
      description: 'PMP, PRINCE2, Agile, Lean Six Sigma',
      href: '/formations/gestion-projet',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Users2 className="w-10 h-10" />,
      title: t.categories.management,
      description: 'Leadership, RH, Stratégie, Management',
      href: '/formations/management-leadership',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: t.categories.careers,
      description: 'Banque, Finance, Logistique, Industrie',
      href: '/formations/filieres-metiers',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: t.categories.commercial,
      description: 'Ventes, Négociation, Relation client',
      href: '/formations/performance-commerciale',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Languages className="w-10 h-10" />,
      title: t.categories.languages,
      description: 'TOEIC, TOEFL, GRE, Anglais',
      href: '/formations/langues',
      color: 'border-orange-200 hover:border-orange-600'
    },
  ]

  const values = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: t.home.valueEthics,
      description: t.home.valueEthicsDesc
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t.home.valueProximity,
      description: t.home.valueProximityDesc
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t.home.valueExcellence,
      description: t.home.valueExcellenceDesc
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t.home.valueInnovation,
      description: t.home.valueInnovationDesc
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <section className="py-4 bg-transparent">
          <Partners />
        </section>

        {/* Domaines de formation */}
        <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="section-title">{t.home.domainsTitle}</h2>
              <p className="section-subtitle text-orange-100">
                {t.home.domainsSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domains.map((domain, index) => (
                <Link 
                  key={index}
                  href={domain.href}
                  className={`bg-white/10 border border-white/10 ${domain.color} rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-orange-200">{domain.icon}</div>
                    <h3 className="text-lg font-semibold text-orange-100">{domain.title}</h3>
                  </div>
                  <p className="text-orange-200 text-sm">{domain.description}</p>
                  <div className="mt-3 text-orange-100 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t.home.seeFormations} <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-20 bg-transparent border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="section-title">{t.home.valuesTitle}</h2>
              <p className="section-subtitle text-orange-200/70">
                {t.home.valuesSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 mb-4 group-hover:bg-orange-500/30 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-orange-200/70 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.home.solutionsTitle}</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              {t.home.solutionsSubtitle}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="h-16 mb-2 flex items-center justify-center">
                  <Image
                    src="/images/conseil.jpeg"
                    alt="Conseil"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <p className="font-semibold">{language === 'fr' ? 'Conseil' : 'Consulting'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="h-16 mb-2 flex items-center justify-center">
                  <Image
                    src="/images/formation.jpeg"
                    alt="Formation"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <p className="font-semibold">{language === 'fr' ? 'Formation' : 'Training'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="h-16 mb-2 flex items-center justify-center">
                  <Image
                    src="/images/recrutement.jpeg"
                    alt="Recrutement"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <p className="font-semibold">{language === 'fr' ? 'Recrutement' : 'Recruitment'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="h-16 mb-2 flex items-center justify-center">
                  <Image
                    src="/images/accompagnement.jpeg"
                    alt="Accompagnement"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <p className="font-semibold">{language === 'fr' ? 'Accompagnement' : 'Support'}</p>
              </div>
            </div>
            <Link 
              href="/nos-solutions"
              className="inline-flex items-center gap-2 mt-8 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              {t.home.discoverSolutions}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Dates de formation */}
        <TrainingDates />

        {/* Témoignages */}
        <Testimonials />

        {/* CTA */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{t.home.readyTitle}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t.home.readySubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-900 transition-colors"
              >
                {t.home.contactUs}
              </Link>
              <Link 
                href="/catalogue"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-colors"
              >
                {t.home.downloadCatalog}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}