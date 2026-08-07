import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Hero from '@/app/components/Hero'
import Testimonials from '@/app/components/Testimonials'
import TrainingDates from '@/app/components/TrainingDates'
import Link from 'next/link'
import { 
  Award, Users, Target, BookOpen, CheckCircle, Clock, 
  GraduationCap, Globe, FileText, BarChart, ChevronRight,
  Server, Projector, Users2, Briefcase, TrendingUp, Languages,
  Handshake
} from 'lucide-react'

export default function Home() {
  const domains = [
    {
      icon: <Server className="w-10 h-10" />,
      title: 'Technologies & Cybersécurité',
      description: 'IA, Cloud, Sécurité, Réseaux, Data',
      href: '/formations/technologies-numeriques',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Projector className="w-10 h-10" />,
      title: 'Gestion de Projet',
      description: 'PMP, PRINCE2, Agile, Lean Six Sigma',
      href: '/formations/gestion-projet',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Users2 className="w-10 h-10" />,
      title: 'Management & Leadership',
      description: 'Leadership, RH, Stratégie, Management',
      href: '/formations/management-leadership',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: 'Filières Métiers',
      description: 'Banque, Finance, Logistique, Industrie',
      href: '/formations/filieres-metiers',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'Performance Commerciale',
      description: 'Ventes, Négociation, Relation client',
      href: '/formations/performance-commerciale',
      color: 'border-orange-200 hover:border-orange-600'
    },
    {
      icon: <Languages className="w-10 h-10" />,
      title: 'Langues & Certifications',
      description: 'TOEIC, TOEFL, GRE, Anglais',
      href: '/formations/langues',
      color: 'border-orange-200 hover:border-orange-600'
    },
  ]

  const values = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Éthique & Intégrité',
      description: 'Respect des principes professionnels, transparence et responsabilité'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Proximité Client',
      description: 'Relation durable basée sur l\'écoute, la confiance et la compréhension'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Qualité, rigueur et efficacité au cœur de nos interventions'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Solutions adaptées aux nouveaux défis professionnels'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />

        {/* Domaines de formation */}
        <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="section-title">Nos Domaines de Formation</h2>
              <p className="section-subtitle text-orange-100">
                Des programmes adaptés aux besoins des entreprises pour développer les compétences de vos équipes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domains.map((domain, index) => (
                <Link 
                  key={index}
                  href={domain.href}
                  className={`bg-white/10 border border-white/10 ${domain.color} rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-orange-200">{domain.icon}</div>
                    <h3 className="text-lg font-semibold text-orange-100">{domain.title}</h3>
                  </div>
                  <p className="text-orange-200 text-sm">{domain.description}</p>
                  <div className="mt-3 text-orange-100 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Voir les formations <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="section-title">Nos Valeurs</h2>
              <p className="section-subtitle">
                La performance durable des organisations passe par le développement du capital humain
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full text-orange-600 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Solutions</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Conseil stratégique • Formation professionnelle • Développement des compétences • Recrutement
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="text-3xl mb-2">📊</div>
                <p className="font-semibold">Conseil</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="text-3xl mb-2">🎓</div>
                <p className="font-semibold">Formation</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="text-3xl mb-2">💼</div>
                <p className="font-semibold">Recrutement</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-semibold">Accompagnement</p>
              </div>
            </div>
            <Link 
              href="/nos-solutions"
              className="inline-flex items-center gap-2 mt-8 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Découvrir nos solutions
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Dates de formation */}
        <TrainingDates />

        {/* Témoignages */}
        <Testimonials />

        {/* CTA */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à développer votre organisation ?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour un diagnostic gratuit et découvrez comment nous pouvons vous accompagner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-900 transition-colors"
              >
                Nous contacter
              </Link>
              <Link 
                href="/catalogue"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-colors"
              >
                Télécharger le catalogue
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}