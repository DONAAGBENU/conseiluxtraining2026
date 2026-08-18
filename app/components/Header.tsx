"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, ChevronDown, Globe, FileText } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [animatedText, setAnimatedText] = useState('')
  const [animDone, setAnimDone] = useState(false)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const fullText = 'Conseilux Training & Development'

  useEffect(() => {
    // Clean up any previous animation
    if (animRef.current) clearTimeout(animRef.current)
    setAnimatedText('')
    setAnimDone(false)
    let i = 0
    const type = () => {
      if (i < fullText.length) {
        setAnimatedText(fullText.slice(0, i + 1))
        i++
        animRef.current = setTimeout(type, 75)
      } else {
        setAnimDone(true)
      }
    }
    // Small delay so re-mount feels intentional
    animRef.current = setTimeout(type, 200)
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [])

  const navItems = [
    { label: t.nav.home, href: '/' },
    { 
      label: t.nav.formations, 
      href: '/formations',
      dropdown: [
        { label: t.categories.technology, href: '/formations/technologies-numeriques' },
        { label: t.categories.projectManagement, href: '/formations/gestion-projet' },
        { label: t.categories.management, href: '/formations/management-leadership' },
        { label: t.categories.careers, href: '/formations/filieres-metiers' },
        { label: t.categories.commercial, href: '/formations/performance-commerciale' },
        { label: t.categories.languages, href: '/formations/langues' },
      ]
    },
    { label: t.nav.solutions, href: '/nos-solutions' },
    { label: t.nav.catalogue, href: '/catalogue' },
    { label: t.nav.evaluation, href: '/evaluation' },
    { label: t.nav.reviews, href: '/avis' },
    { label: t.nav.contact, href: '/contact' },
  ]

  const phoneNumbers = [
    { country: 'Bénin', number: '+229 01 29 23 91 94' },
    { country: 'Togo', number: '+228 90 54 64 64' },
    { country: 'Côte d\'Ivoire', number: '+225 07 58 97 03 44' },
    { country: 'Niger', number: '+227 82 64 86 04' },
    { country: 'France', number: '+33 7 456 441 81' },
  ]

  return (
    <header className="bg-slate-950/85 backdrop-blur-md shadow-md sticky top-0 z-50 w-full">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center shadow-inner shadow-black/15 ring-1 ring-white/15">
              <Image
                src="/images/logo conseilux vectoriel  [Récupéré]_Plan de travail 1.png"
                alt="Logo Conseilux Training and Developement"
                width={56}
                height={56}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="ml-2 hidden md:block" style={{ width: '220px' }}>
              <h1 className="text-base font-bold text-white leading-tight" style={{ minHeight: '22px', width: '100%', overflow: 'hidden' }}>
                {animatedText}
                {!animDone && (
                  <span className="animate-pulse text-orange-800">|</span>
                )}
              </h1>
            </div>
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden xl:flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.href} className="relative group">
                {item.dropdown ? (
                  <button
                    className="text-orange-800 hover:text-white transition-colors font-medium flex items-center gap-1"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-orange-800 hover:text-white transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
                
                {/* Dropdown */}
                {item.dropdown && openDropdown === item.label && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-white/10 rounded-lg shadow-xl py-2 z-50"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-orange-800 hover:bg-white/20 hover:text-white transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
            
            {/* Social Links */}
            <li className="flex items-center gap-2">
              <Link
                href="https://www.linkedin.com/company/conseilux-training-and-development/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-800 hover:text-orange-900 transition-colors"
                title="LinkedIn"
              >
                <LinkedInIcon />
              </Link>
              <Link
                href="https://www.facebook.com/share/1EqDD3THTx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-800 hover:text-orange-900 transition-colors"
                title="Facebook"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-800 hover:text-orange-900 transition-colors"
                title="Twitter"
              >
                <TwitterIcon />
              </Link>
            </li>
            
            {/* Language Switcher */}
            <li className="flex items-center">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="text-orange-800 hover:text-white transition-colors font-bold text-xs px-2 py-1 rounded border border-white/20 hover:border-orange-900/50 tracking-wider"
              >
                {language === 'fr' ? 'FR' : 'EN'}
              </button>
            </li>
            
            <li>
              <Link 
                href="/catalogue"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-800 to-orange-900 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-orange-800/30 hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
              >
                <FileText className="w-4 h-4 shrink-0" />
                {t.nav.downloadCatalogue}
              </Link>
            </li>
          </ul>

          {/* Menu Mobile Button */}
          <button 
            className="xl:hidden text-orange-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="xl:hidden mt-4 border-t border-white/5 pt-4 space-y-3">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.dropdown ? (
                  <div className="space-y-2">
                    <span className="font-semibold text-orange-800">{item.label}</span>
                    <div className="pl-4 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block text-orange-800 hover:text-white transition-colors py-1 text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="block text-orange-800 hover:text-white transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Social Links Mobile */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              <Link
                href="https://www.linkedin.com/company/conseilux-training-and-development/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-800 hover:text-orange-900 transition-colors"
                title="LinkedIn"
              >
                <LinkedInIcon />
              </Link>
              <Link
                href="https://www.facebook.com/share/1EqDD3THTx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-800 hover:text-orange-900 transition-colors"
                title="Facebook"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-800 hover:text-orange-900 transition-colors"
                title="Twitter"
              >
                <TwitterIcon />
              </Link>
            </div>
            
            {/* Language Switcher Mobile */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-2 text-orange-800 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg border border-white/20 hover:border-orange-900/50"
              >
                <Globe className="w-4 h-4" />
                {language === 'fr' ? 'FR' : 'EN'}
              </button>
            </div>
            
            {/* Numéros mobile */}
            {/* numéros supérieurs retirés */}
          </div>
        )}
      </nav>
    </header>
  )
}