"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, ChevronDown, Globe, GraduationCap } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from './LanguageProvider'
import ThemeToggle from './ThemeToggle'

// SVG Icons for social media
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { language, setLanguage, t } = useLanguage()

  const languageCenterLabel = language === 'fr' ? 'Centre de Langues' : 'Language Center'

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

  return (
    <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs sticky top-0 z-50 w-full transition-colors duration-200">
      <nav className="container mx-auto px-4 py-2.5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo-transparent-white-text-cropped.png"
              alt="Logo Conseilux Training and Development"
              width={110}
              height={80}
              style={{ height: 'auto' }}
              className="object-contain dark:brightness-100 brightness-75 group-hover:scale-105 transition-transform duration-200"
              priority
            />
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden xl:flex items-center space-x-5">
            {navItems.map((item) => (
              <li key={item.href} className="relative group">
                {item.dropdown ? (
                  <button
                    className="text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-400 font-medium text-sm flex items-center gap-1 py-2 transition-colors cursor-pointer"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-400 font-medium text-sm py-2 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
                
                {/* Dropdown */}
                {item.dropdown && openDropdown === item.label && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
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
            <li className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                href="https://www.linkedin.com/company/conseilux-training-and-development/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors p-1"
                title="LinkedIn"
              >
                <LinkedInIcon />
              </Link>
              <Link
                href="https://www.facebook.com/share/1EqDD3THTx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors p-1"
                title="Facebook"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors p-1"
                title="Twitter"
              >
                <TwitterIcon />
              </Link>
            </li>
            
            {/* Theme Toggle (Noir / Blanc) */}
            <li>
              <ThemeToggle compact={true} />
            </li>

            {/* Language Switcher */}
            <li>
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all flex items-center gap-1 cursor-pointer"
                title={language === 'fr' ? 'Switch to English' : 'Passer au Français'}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'EN' : 'FR'}</span>
              </button>
            </li>
            
            {/* Bouton Centre de Langues */}
            <li className="shrink-0">
              <Link 
                href="/centre-de-langues"
                className="inline-flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-md shadow-orange-600/20 hover:shadow-orange-600/30 transition-all duration-200 shrink-0 whitespace-nowrap active:scale-[0.98]"
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>{languageCenterLabel}</span>
              </Link>
            </li>
          </ul>

          {/* Mobile Right Controls: Theme + Menu toggle */}
          <div className="xl:hidden flex items-center gap-2">
            <ThemeToggle compact={true} />
            <button 
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 pb-3">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.dropdown ? (
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{item.label}</span>
                    <div className="pl-3 space-y-1 mt-1 border-l-2 border-orange-500/30">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 py-1 text-xs"
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
                    className="block text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium text-sm py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Bouton Centre de Langues (mobile) */}
            <div className="pt-2">
              <Link
                href="/centre-de-langues"
                className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-orange-600/20 w-full justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>{languageCenterLabel}</span>
              </Link>
            </div>
            
            {/* Language Switcher Mobile */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Passer en Anglais' : 'Switch to French'}</span>
              </button>

              {/* Social Links Mobile */}
              <div className="flex items-center gap-3">
                <Link
                  href="https://www.linkedin.com/company/conseilux-training-and-development/about/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-orange-600 dark:text-slate-400"
                >
                  <LinkedInIcon />
                </Link>
                <Link
                  href="https://www.facebook.com/share/1EqDD3THTx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-orange-600 dark:text-slate-400"
                >
                  <FacebookIcon />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}