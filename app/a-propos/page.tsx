"use client"

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function APropos() {
  const { t, language } = useLanguage()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">{t.about.title}</h1>
        <p className="text-orange-800/80">
          {language === 'fr' ? 'Découvrez l\'histoire et les valeurs de ConseiluxTraining.' : 'Discover the history and values of ConseiluxTraining.'}
        </p>
      </main>
      <Footer />
    </div>
  )
}