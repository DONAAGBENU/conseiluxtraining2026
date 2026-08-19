"use client"

import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, ArrowUp } from 'lucide-react'
import PartnerLogos from './PartnerLogos'
import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageProvider'

// SVG Icons for social media
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

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
                <span className="text-orange-800">Conseilux</span> Training and Development
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                {t.footer.about}
              </p>
              <div className="flex space-x-4">
                <Link 
                  href="https://www.linkedin.com/company/conseilux-training-and-development/about/?viewAsMember=true" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-800 transition-colors"
                  title="LinkedIn"
                >
                  <LinkedInIcon />
                </Link>
                <Link 
                  href="https://www.facebook.com/share/1EqDD3THTx/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-800 transition-colors"
                  title="Facebook"
                >
                  <FacebookIcon />
                </Link>
                <Link 
                  href="#" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-800 transition-colors"
                  title="Twitter"
                >
                  <TwitterIcon />
                </Link>
              </div>
            </div>

            {/* Formations */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-800">{t.footer.ourFormations}</h4>
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
              <h4 className="font-semibold mb-4 text-orange-800">{language === 'fr' ? 'Nos Bureaux' : 'Our Offices'}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {phoneNumbers.map((phone) => (
                  <li key={phone.country} className="flex items-center gap-2">
                    <Phone size={14} className="text-orange-800 flex-shrink-0" />
                    <span>{phone.country}: {phone.number}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-gray-400 text-sm">
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-orange-800" />
                  contact@conseiluxtraining.com
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-orange-800" />
                  Lun-Ven: 8h-18h
                </p>
              </div>
            </div>

            {/* Liens */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-800">{t.footer.quickLinks}</h4>
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
            <div className="absolute bottom-0 right-4 text-orange-800/60 text-xs font-medium">
              by DONA
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-800 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Remonter en haut"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}