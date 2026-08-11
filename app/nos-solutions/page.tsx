import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { 
  Package, Settings, Database, Cloud, ShoppingCart, 
  Briefcase, Users, FileText, CheckCircle, ArrowRight,
  Laptop, Building, TrendingUp, Award
} from 'lucide-react'
import Link from 'next/link'

export default function NosSolutions() {
  const softwareSolutions = [
    {
      name: 'SAP',
      description: 'ERP complet pour la gestion d\'entreprise',
      features: ['Finance & Comptabilité', 'RH & Paie', 'Logistique', 'Ventes'],
      icon: <Settings className="w-12 h-12" />,
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      name: 'Sage 100',
      description: 'Gestion commerciale et comptabilité',
      features: ['Comptabilité', 'Facturation', 'Gestion de stock', 'CRM'],
      icon: <Database className="w-12 h-12" />,
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      name: 'Microsoft 365',
      description: 'Suite collaborative et productive',
      features: ['Teams', 'SharePoint', 'Power BI', 'Office'],
      icon: <Cloud className="w-12 h-12" />,
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      name: 'Power Platform',
      description: 'Automatisation et analyse de données',
      features: ['Power BI', 'Power Apps', 'Power Automate', 'Power Virtual Agents'],
      icon: <TrendingUp className="w-12 h-12" />,
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      name: 'EBP',
      description: 'Solutions de gestion pour TPE/PME',
      features: ['Comptabilité', 'Paie', 'Gestion commerciale', 'Immobilisations'],
      icon: <Briefcase className="w-12 h-12" />,
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      name: 'Azure',
      description: 'Cloud computing et infrastructure',
      features: ['VM', 'Stockage', 'Sécurité', 'IA'],
      icon: <Laptop className="w-12 h-12" />,
      color: 'border-orange-200 hover:border-orange-600'
    },
  ]

  const services = [
    {
      title: 'Conseil & Choix de la solution',
      description: 'Nous vous aidons à sélectionner la solution la plus adaptée à vos besoins'
    },
    {
      title: 'Paramétrage & Intégration',
      description: 'Configuration sur mesure et intégration avec vos systèmes existants'
    },
    {
      title: 'Migration des données',
      description: 'Reprise et migration sécurisée de vos données'
    },
    {
      title: 'Formation utilisateurs',
      description: 'Formation complète de vos équipes sur les nouveaux outils'
    },
    {
      title: 'Support & Maintenance',
      description: 'Assistance continue et maintenance de vos solutions'
    },
    {
      title: 'Accompagnement au changement',
      description: 'Support pour l\'adoption et la transition vers les nouveaux outils'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Solutions</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Digitalisez et automatisez la gestion de votre entreprise
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Nos Prestations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div key={index} className="card border-l-4 border-orange-600 flex items-start gap-4 bg-white/10 backdrop-blur-md border-white/10">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{service.title}</h3>
                    <p className="text-sm text-orange-200/80">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logiciels */}
        <section className="py-16 bg-transparent border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              Nos Solutions Logicielles
            </h2>
            <p className="text-center text-orange-200/60 mb-12 max-w-2xl mx-auto">
              Des logiciels de gestion adaptés à tous les secteurs d'activité
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {softwareSolutions.map((solution, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-orange-500 mb-4">{solution.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{solution.name}</h3>
                    <p className="text-orange-200/80 mb-4 text-sm">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-orange-100 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-2 mt-6 text-orange-500 font-semibold hover:text-white transition-colors"
                  >
                    En savoir plus <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Besoin d'une solution sur mesure ?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour un diagnostic gratuit de vos besoins
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Nous consulter
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}