import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { CheckCircle, Clock, Users, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function TechnologiesNumeriques() {
  const trainings = [
    {
      title: 'Intelligence Artificielle Générative',
      duration: '2 jours',
      modules: [
        'Prise en main IA générative - comprendre & adopter',
        'IA Connect - masterclass + e-learning',
        'Propulsez votre productivité avec l\'IA générative',
        'Exploitez l\'IA générative pour transformer votre entreprise'
      ]
    },
    {
      title: 'Cybersécurité',
      duration: '5 jours',
      modules: [
        'CISO — Chief Information Security Officer',
        'ISO/IEC 27001 Lead Implementer',
        'CISM® - Manager certifié en sécurité',
        'CISSP® - Professionnel certifié sécurité'
      ]
    },
    {
      title: 'Cloud & Infrastructure',
      duration: '3-5 jours',
      modules: [
        'AWS Cloud Practitioner',
        'Microsoft Azure Administrator (AZ-104)',
        'CCSP® - Spécialiste sécurité du cloud',
        'Power Platform - Développeur'
      ]
    },
    {
      title: 'Réseaux & Sécurité',
      duration: '5 jours',
      modules: [
        'CCNA - Cisco Certified Network Associate',
        'CompTIA Security+',
        'Certified Ethical Hacker (CEH)',
        'Sécurisation des réseaux'
      ]
    },
    {
      title: 'Data & Analytics',
      duration: '3 jours',
      modules: [
        'Science des données pour débutants',
        'Power BI - Intermédiaire / Avancé',
        'Excel Power Query',
        'Analyse de données et applications'
      ]
    },
    {
      title: 'Suite Office & Collaboratif',
      duration: '3-5 jours',
      modules: [
        'Excel - Débutant à Avancé',
        'Microsoft 365 Admin',
        'SharePoint - Concepteur',
        'Teams - Administrateur'
      ]
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Technologies Numériques & Cybersécurité
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Formez vos équipes aux technologies de demain
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map((training, index) => (
                <div key={index} className="card border-t-4 border-orange-600 bg-white/10 backdrop-blur-md border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">{training.title}</h3>
                  <p className="text-sm text-orange-200/60 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    {training.duration}
                  </p>
                  <ul className="space-y-2">
                    {training.modules.map((module, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-orange-100/90">{module}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/contact"
                    className="mt-6 inline-block bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-500 transition-colors text-sm shadow-md shadow-orange-600/10 text-center"
                  >
                    Demander un devis
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}