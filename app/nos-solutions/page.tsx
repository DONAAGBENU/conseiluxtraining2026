"use client"

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function NosSolutions() {
  const { t, language } = useLanguage()
  const softwareSolutions = [
    {
      name: 'SAP ERP',
      description: language === 'fr' ? 'ERP complet pour le pilotage d\'entreprise' : 'Complete ERP for enterprise management',
      features: language === 'fr' ? ['Finance & Comptabilité', 'RH & Paie', 'Logistique', 'Ventes'] : ['Finance & Accounting', 'HR & Payroll', 'Logistics', 'Sales'],
      image: '/images/conseil.jpeg',
    },
    {
      name: 'Sage 100',
      description: language === 'fr' ? 'Gestion commerciale et comptabilité analytique' : 'Commercial management and accounting',
      features: language === 'fr' ? ['Comptabilité', 'Facturation', 'Gestion de stock', 'CRM'] : ['Accounting', 'Invoicing', 'Stock management', 'CRM'],
      image: '/images/formation.jpeg',
    },
    {
      name: 'Microsoft 365 & Copilot',
      description: language === 'fr' ? 'Suite collaborative, productivité et IA intégrée' : 'Collaborative suite, productivity and AI',
      features: ['Teams', 'SharePoint', 'Power BI', 'Office 365'],
      image: '/images/recrutement.jpeg',
    },
    {
      name: 'Microsoft Power Platform',
      description: language === 'fr' ? 'Automatisation de processus et tableaux de bord' : 'Process automation and data dashboards',
      features: ['Power BI', 'Power Apps', 'Power Automate', 'Copilot Studio'],
      image: '/images/accompagnement.jpeg',
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-14 md:py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 block">
              {language === 'fr' ? 'Accompagnement & Expertise' : 'Expertise & Solutions'}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t.solutions.title}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.solutions.subtitle}
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {t.solutions.services}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs border-l-4 border-l-orange-600 flex items-start gap-4 hover:shadow-lg transition-all"
                >
                  <CheckCircle className="w-5 h-5 text-orange-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-base">{service.title}</h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logiciels */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {t.solutions.software}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {language === 'fr' ? 'Des solutions logicielles de premier ordre adaptées aux exigences métiers' : 'Leading software solutions adapted to your business needs'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {softwareSolutions.map((solution, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 p-2">
                      <Image
                        src={solution.image}
                        alt={solution.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{solution.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 text-xs leading-relaxed">{solution.description}</p>
                    
                    <ul className="space-y-1.5 mb-6">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:gap-2 transition-all pt-3 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>{t.solutions.learnMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-3xl p-10 md:p-14 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{t.solutions.ctaTitle}</h2>
              <p className="text-sm md:text-base text-orange-100 mb-8 max-w-xl mx-auto leading-relaxed">
                {t.solutions.ctaSubtitle}
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>{t.solutions.consultUs}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}