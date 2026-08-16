"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, ChevronDown, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageProvider'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [animatedText, setAnimatedText] = useState('')
  const { language, setLanguage, t } = useLanguage()
  const fullText = 'Conseilux Training and Development'

  useEffect(() => {
    const animateText = () => {
      let index = 0
      setAnimatedText('')
      
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setAnimatedText(fullText.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
        }
      }, 100)
      
      return () => clearInterval(interval)
    }
    
    // Animation initiale
    animateText()
    
    // Rejouer l'animation toutes les 10 secondes
    const repeatInterval = setInterval(() => {
      animateText()
    }, 10000)
    
    return () => clearInterval(repeatInterval)
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
    <header className="bg-white/5 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center shadow-inner shadow-black/15 ring-1 ring-white/15">
              <Image
                src="/images/logo%20conseilux%20vectoriel%20%20%5BR%C3%A9cup%C3%A9r%C3%A9%5D_Plan%20de%20travail%201.png"
                alt="Logo Conseilux Training and Developement"
                width={56}
                height={56}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="ml-3 hidden md:block">
              <h1 className="text-lg font-bold text-white leading-tight" style={{ width: '240px', minHeight: '24px' }}>
                {animatedText}
                <span className="animate-pulse">|</span>
              </h1>
            </div>
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.href} className="relative group">
                {item.dropdown ? (
                  <button
                    className="text-orange-100 hover:text-white transition-colors font-medium flex items-center gap-1"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-orange-100 hover:text-white transition-colors font-medium"
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
                        className="block px-4 py-2 text-orange-100 hover:bg-white/20 hover:text-white transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
            
            {/* Language Switcher */}
            <li className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg border border-white/20 hover:border-orange-500/50"
              >
                <Globe className="w-4 h-4" />
                {language === 'fr' ? 'FR' : 'EN'}
              </button>
            </li>
            
            <li>
              <Link 
                href="/catalogue"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg shadow-orange-500/30 hover:from-orange-400 hover:to-orange-500 transition-all duration-300"
              >
                {t.nav.downloadCatalogue}
              </Link>
            </li>
          </ul>

          {/* Menu Mobile Button */}
          <button 
            className="lg:hidden text-orange-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-white/5 pt-4 space-y-3">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.dropdown ? (
                  <div className="space-y-2">
                    <span className="font-semibold text-orange-100">{item.label}</span>
                    <div className="pl-4 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block text-orange-200 hover:text-white transition-colors py-1 text-sm"
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
                    className="block text-orange-100 hover:text-white transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Language Switcher Mobile */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg border border-white/20 hover:border-orange-500/50"
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