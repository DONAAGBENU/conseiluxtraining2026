"use client"

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Link from 'next/link'
import { Award, Users, CheckCircle2, ShieldCheck, Target, ArrowRight, BookOpen, Globe2 } from 'lucide-react'
import { useLanguage } from '@/app/components/LanguageProvider'

export default function APropos() {
  const { t, language } = useLanguage()

  const stats = [
    { label: language === 'fr' ? 'Cadres & Professionnels Formés' : 'Professionals Trained', value: '1 500+' },
    { label: language === 'fr' ? 'Taux de Réussite aux Certifications' : 'Certification Pass Rate', value: '98%' },
    { label: language === 'fr' ? 'Entreprises & Institutions Partenaires' : 'Partner Companies & Institutions', value: '120+' },
    { label: language === 'fr' ? 'Années d’Excellence Opérationnelle' : 'Years of Operational Excellence', value: '10+' },
  ]

  const values = [
    {
      icon: Target,
      title: language === 'fr' ? 'Excellence Opérationnelle' : 'Operational Excellence',
      description: language === 'fr' 
        ? 'Des programmes alignés sur les standards internationaux les plus stricts (PECB, PMI, Axelos, AWS, ETS).' 
        : 'Curricula strictly aligned with top global accreditation bodies (PECB, PMI, Axelos, AWS, ETS).'
    },
    {
      icon: ShieldCheck,
      title: language === 'fr' ? 'Ancrage Pratique & ROI' : 'Practical Focus & ROI',
      description: language === 'fr'
        ? '70% de cas réels, d\'ateliers et de simulations pratiques directement transposables dans votre quotidien professionnel.'
        : '70% real-world case studies, workshops, and business simulations immediately applicable to the workplace.'
    },
    {
      icon: Users,
      title: language === 'fr' ? 'Formateurs Praticiens' : 'Expert Practitioners',
      description: language === 'fr'
        ? 'Tous nos instructeurs sont des consultants seniors et des leaders certifiés en activité, apportant retours d’expérience et méthodologies éprouvées.'
        : 'Our instructors are senior practicing consultants and certified leaders providing proven industry methodologies.'
    },
    {
      icon: Globe2,
      title: language === 'fr' ? 'Rayonnement Régional & International' : 'Regional & Global Reach',
      description: language === 'fr'
        ? 'Présent au Togo, au Bénin et accompagnant des talents et équipes sur toute l’Afrique de l’Ouest et en distanciel mondial.'
        : 'Operating across West Africa with hybrid & distance learning reaching talents worldwide.'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-3.5 py-1.5 rounded-full mb-4">
              {language === 'fr' ? 'Qui sommes-nous' : 'About Us'}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              {language === 'fr' ? 'Bâtir les Compétences des Leaders de Demain' : 'Building Skills for Tomorrow’s Leaders'}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {language === 'fr'
                ? 'ConseiluxTraining est le centre d\'excellence dédié à la formation continue certifiante, au perfectionnement managérial, aux technologies de pointe et à la maîtrise des langues professionnelles.'
                : 'ConseiluxTraining is an elite center dedicated to certified professional training, executive leadership, advanced technologies, and corporate language mastery.'}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((s, idx) => (
                <div key={idx} className="p-4">
                  <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
                    {s.value}
                  </p>
                  <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {language === 'fr' ? 'Notre Vocation' : 'Our Purpose'}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                  {language === 'fr' 
                    ? 'Accélérer la compétitivité humaine des organisations' 
                    : 'Accelerating organizational human competitiveness'}
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  <p>
                    {language === 'fr'
                      ? 'Fondé pour répondre aux exigences croissantes de transformation numérique, de conformité réglementaire et d’ouverture internationale, ConseiluxTraining conçoit des parcours de formation sur-mesure et certifiants.'
                      : 'Founded to address growing demands for digital transformation, regulatory compliance, and international growth, ConseiluxTraining designs bespoke, certified training paths.'}
                  </p>
                  <p>
                    {language === 'fr'
                      ? 'Nos dispositifs pédagogiques combinent théorie rigoureuse, cas pratiques réels, examens blancs encadrés et coaching individualisé pour garantir le succès de vos collaborateurs à leurs examens de certification.'
                      : 'Our educational methodology pairs rigorous theory, real case studies, supervised mock exams, and individualized coaching to ensure your teams succeed at international certification exams.'}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/formations"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-orange-600/20 transition-all text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    {language === 'fr' ? 'Explorer nos formations' : 'Browse our courses'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold px-6 py-3 rounded-xl text-slate-800 dark:text-slate-200 transition-all text-sm"
                  >
                    {language === 'fr' ? 'Contacter un conseiller' : 'Speak with an advisor'}
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80"
                    alt="Conseilux Training Team"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xl max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {language === 'fr' ? 'Partenaire Agréé' : 'Accredited Partner'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        PECB, PMI, Axelos, ETS Global
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {language === 'fr' ? 'Nos Piliers' : 'Our Core Values'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {language === 'fr' ? 'Ce qui fait la différence Conseilux' : 'The Conseilux Standard'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => {
                const IconComponent = v.icon
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                        {v.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}