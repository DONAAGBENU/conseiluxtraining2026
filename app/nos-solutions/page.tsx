"use client"

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { 
  CheckCircle, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function NosSolutions() {
  const { t, language } = useLanguage()
  const softwareSolutions = [
    {
      name: 'SAP',
      description: language === 'fr' ? 'ERP complet pour la gestion d\'entreprise' : 'Complete ERP for business management',
      features: language === 'fr' ? ['Finance & Comptabilité', 'RH & Paie', 'Logistique', 'Ventes'] : ['Finance & Accounting', 'HR & Payroll', 'Logistics', 'Sales'],
      image: '/images/conseil.jpeg',
      color: 'border-orange-800 hover:border-orange-900'
    },
    {
      name: 'Sage 100',
      description: language === 'fr' ? 'Gestion commerciale et comptabilité' : 'Commercial management and accounting',
      features: language === 'fr' ? ['Comptabilité', 'Facturation', 'Gestion de stock', 'CRM'] : ['Accounting', 'Invoicing', 'Stock management', 'CRM'],
      image: '/images/formation.jpeg',
      color: 'border-orange-800 hover:border-orange-900'
    },
    {
      name: 'Microsoft 365',
      description: language === 'fr' ? 'Suite collaborative et productive' : 'Collaborative and productive suite',
      features: ['Teams', 'SharePoint', 'Power BI', 'Office'],
      image: '/images/recrutement.jpeg',
      color: 'border-orange-800 hover:border-orange-900'
    },
    {
      name: 'Power Platform',
      description: language === 'fr' ? 'Automatisation et analyse de données' : 'Automation and data analysis',
      features: ['Power BI', 'Power Apps', 'Power Automate', 'Power Virtual Agents'],
      image: '/images/accompagnement.jpeg',
      color: 'border-orange-800 hover:border-orange-900'
    },
  ]

  const services = [
    {
      title: t.solutions.service1,
      description: t.solutions.service1Desc
    },
    {
      title: t.solutions.service2,
      description: t.solutions.service2Desc
    },
    {
      title: t.solutions.service3,
      description: t.solutions.service3Desc
    },
    {
      title: t.solutions.service4,
      description: t.solutions.service4Desc
    },
    {
      title: t.solutions.service5,
      description: t.solutions.service5Desc
    },
    {
      title: t.solutions.service6,
      description: t.solutions.service6Desc
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{t.solutions.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t.solutions.subtitle}
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
              {t.solutions.services}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div key={index} className="card border-l-4 border-orange-800 flex items-start gap-4 bg-white/10 backdrop-blur-md border-white/10">
                  <CheckCircle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{service.title}</h3>
                    <p className="text-sm text-white/80">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logiciels */}
        <section className="py-16 bg-transparent border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
              {t.solutions.software}
            </h2>
            <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
              {language === 'fr' ? 'Des logiciels de gestion adaptés à tous les secteurs d\'activité' : 'Management software adapted to all business sectors'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {softwareSolutions.map((solution, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-white mb-4 h-16 w-16 rounded-lg overflow-hidden">
                      <Image 
                        src={solution.image} 
                        alt={solution.name}
                        width={64}
                        height={64}
                        className="object-contain w-auto h-auto"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{solution.name}</h3>
                    <p className="text-white/80 mb-4 text-sm">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-white flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-white shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 mt-6 text-white font-semibold hover:text-orange-300 transition-colors"
                  >
                    {t.solutions.learnMore} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-orange-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{t.solutions.ctaTitle}</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t.solutions.ctaSubtitle}
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-orange-800 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              {t.solutions.consultUs}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}