"use client"

import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Globe, Share2, Play, ArrowUp } from 'lucide-react'
import PartnerLogos from './PartnerLogos'
import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageProvider'

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const phoneNumbers = [
    { country: 'Bénin', number: '+229 01 29 23 91 94' },
    { country: 'Togo', number: '+228 90 54 64 64' },
    { country: "Côte d'Ivoire", number: '+225 07 58 97 03 44' },
    { country: 'Niger', number: '+227 82 64 86 04' },
    { country: 'France', number: '+33 7 456 441 81' },
  ]

  return (
    <>
      <footer className="bg-navy text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-orange-600">Conseilux</span> Training and Development
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                {t.footer.about}
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <Globe className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <Play className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Formations */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-600">{t.footer.ourFormations}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/formations/technologies-numeriques" className="hover:text-white transition-colors">{t.categories.technology}</Link></li>
                <li><Link href="/formations/gestion-projet" className="hover:text-white transition-colors">{t.categories.projectManagement}</Link></li>
                <li><Link href="/formations/management-leadership" className="hover:text-white transition-colors">{t.categories.management}</Link></li>
                <li><Link href="/formations/filieres-metiers" className="hover:text-white transition-colors">{t.categories.careers}</Link></li>
                <li><Link href="/formations/performance-commerciale" className="hover:text-white transition-colors">{t.categories.commercial}</Link></li>
                <li><Link href="/formations/langues" className="hover:text-white transition-colors">{t.categories.languages}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-600">{language === 'fr' ? 'Nos Bureaux' : 'Our Offices'}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {phoneNumbers.map((phone) => (
                  <li key={phone.country} className="flex items-center gap-2">
                    <Phone size={14} className="text-orange-600 flex-shrink-0" />
                    <span>{phone.country}: {phone.number}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-gray-400 text-sm">
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-orange-600" />
                  contact@conseiluxtraining.com
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-orange-600" />
                  Lun-Ven: 8h-18h
                </p>
              </div>
            </div>

            {/* Liens */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-600">{t.footer.quickLinks}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/nos-solutions" className="hover:text-white transition-colors">{t.nav.solutions}</Link></li>
                <li><Link href="/catalogue" className="hover:text-white transition-colors">{t.nav.downloadCatalogue}</Link></li>
                <li><Link href="/avis" className="hover:text-white transition-colors">{t.nav.reviews}</Link></li>
                <li><Link href="/evaluation" className="hover:text-white transition-colors">{t.nav.evaluation}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">{t.nav.contact}</Link></li>
              </ul>
            </div>
          </div>

          {/* Partner Logos */}
          <PartnerLogos />

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm relative">
            <p>© 2026 Conseilux Training and Development. {t.footer.rights}.</p>
            <div className="absolute bottom-0 right-4 text-orange-400/60 text-xs font-medium">
              by DONA
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Remonter en haut"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}