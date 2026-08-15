import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Globe, Share2, Play } from 'lucide-react'

export default function Footer() {
  const phoneNumbers = [
    { country: 'Bénin', number: '+229 01 29 23 91 94' },
    { country: 'Togo', number: '+228 90 54 64 64' },
    { country: "Côte d'Ivoire", number: '+225 07 58 97 03 44' },
    { country: 'Niger', number: '+227 82 64 86 04' },
    { country: 'France', number: '+33 7 456 441 81' },
  ]

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-orange-600">Conseilux</span>Training
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Cabinet de conseil spécialisé en conseil stratégique, formation professionnelle, 
              développement des compétences et recrutement sur mesure.
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
            <h4 className="font-semibold mb-4 text-orange-600">Nos Formations</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/formations/technologies-numeriques" className="hover:text-white transition-colors">Technologie numérique</Link></li>
              <li><Link href="/formations/gestion-projet" className="hover:text-white transition-colors">Gestion de projet</Link></li>
              <li><Link href="/formations/management-leadership" className="hover:text-white transition-colors">Management et leadership</Link></li>
              <li><Link href="/formations/filieres-metiers" className="hover:text-white transition-colors">Filières métiers</Link></li>
              <li><Link href="/formations/performance-commerciale" className="hover:text-white transition-colors">Performance commerciale</Link></li>
              <li><Link href="/formations/langues" className="hover:text-white transition-colors">Langues</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-orange-600">Nos Bureaux</h4>
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
            <h4 className="font-semibold mb-4 text-orange-600">Liens Rapides</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/nos-solutions" className="hover:text-white transition-colors">Nos Solutions</Link></li>
              <li><Link href="/catalogue" className="hover:text-white transition-colors">Télécharger Catalogue</Link></li>
              <li><Link href="/avis" className="hover:text-white transition-colors">Avis Clients</Link></li>
              <li><Link href="/evaluation" className="hover:text-white transition-colors">Évaluation d'Anglais</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm relative">
          <p>© 2026 ConseiluxTraining & Development. Tous droits réservés.</p>
          <div className="absolute bottom-0 right-4 text-orange-400/60 text-xs font-medium">
            by DONA
          </div>
        </div>
      </div>
    </footer>
  )
}