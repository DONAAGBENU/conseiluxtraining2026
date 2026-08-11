"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const navItems = [
    { label: 'Accueil', href: '/' },
    { 
      label: 'Formations', 
      href: '/formations',
      dropdown: [
        { label: 'Technologies & Cybersécurité', href: '/formations/technologies-numeriques' },
        { label: 'Gestion de Projet', href: '/formations/gestion-projet' },
        { label: 'Management & Leadership', href: '/formations/management-leadership' },
        { label: 'Filières Métiers', href: '/formations/filieres-metiers' },
        { label: 'Performance Commerciale', href: '/formations/performance-commerciale' },
        { label: 'Langues', href: '/formations/langues' },
        { label: 'Facilitation Professionnelle', href: '/formations/facilitation-professionnelle' },
      ]
    },
    { label: 'Nos Solutions', href: '/nos-solutions' },
    { label: 'Catalogue', href: '/catalogue' },
    { label: 'Évaluation', href: '/evaluation' },
    { label: 'Avis', href: '/avis' },
    { label: 'Contact', href: '/contact' },
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
                className="object-contain"
              />
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
            <li>
              <Link 
                href="/catalogue"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg shadow-orange-500/30 hover:from-orange-400 hover:to-orange-500 transition-all duration-300"
              >
                Télécharger Catalogue
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
            
            {/* Numéros mobile */}
            {/* numéros supérieurs retirés */}
          </div>
        )}
      </nav>
    </header>
  )
}