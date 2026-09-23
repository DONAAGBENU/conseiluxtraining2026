"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { 
  CheckCircle, Clock, Loader2, Mail, MessageSquare, Send, 
  ChevronRight, Award, Users, BookOpen, ArrowLeft, ShieldCheck, 
  PhoneCall, Download, Check, Sparkles 
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/app/components/LanguageProvider'
import { FORMATIONS_CATALOG, getFormationImage } from '@/app/data/formationsData'

const slugToDbCategory: { [key: string]: string } = {
  'technologies-numeriques': 'Technologie numérique',
  'technologie-numerique': 'Technologie numérique',
  'gestion-projet': 'Gestion de projet',
  'management-leadership': 'Management et leadership',
  'performance-commerciale': 'Performance commerciale',
  'filieres-metiers': 'Filières métiers',
  'langues': 'Langues'
}

const categoryMetadata: { [key: string]: { nameFr: string; nameEn: string; descFr: string; descEn: string } } = {
  'technologies-numeriques': {
    nameFr: 'Technologies Numériques & Cybersécurité',
    nameEn: 'Digital Technologies & Cybersecurity',
    descFr: 'Formez vos équipes aux technologies d\'avenir, au Cloud et à la sécurisation des actifs numériques.',
    descEn: 'Train your teams in cutting-edge technologies, cloud infrastructure, and digital asset security.'
  },
  'technologie-numerique': {
    nameFr: 'Technologies Numériques & Cybersécurité',
    nameEn: 'Digital Technologies & Cybersecurity',
    descFr: 'Formez vos équipes aux technologies d\'avenir, au Cloud et à la sécurisation des actifs numériques.',
    descEn: 'Train your teams in cutting-edge technologies, cloud infrastructure, and digital asset security.'
  },
  'gestion-projet': {
    nameFr: 'Gestion de Projet & Méthodes Agiles',
    nameEn: 'Project Management & Agile',
    descFr: 'Pilotez vos projets stratégiques avec rigueur, vélocité et conformité aux standards internationaux (PMP, PRINCE2, Scrum).',
    descEn: 'Drive strategic projects with rigor, velocity, and alignment with global standards (PMP, PRINCE2, Scrum).'
  },
  'management-leadership': {
    nameFr: 'Management & Leadership',
    nameEn: 'Management & Leadership',
    descFr: 'Développez votre posture de leader, inspirez vos équipes et pilotez la performance durable.',
    descEn: 'Develop your leadership stance, inspire your teams, and manage sustainable performance.'
  },
  'performance-commerciale': {
    nameFr: 'Performance Commerciale & Négociation B2B',
    nameEn: 'Sales Performance & B2B Negotiation',
    descFr: 'Optimisez vos cycles de vente complexe, défendez vos marges et fidélisez vos comptes stratégiques.',
    descEn: 'Optimize complex sales cycles, defend margins, and retain strategic accounts.'
  },
  'filieres-metiers': {
    nameFr: 'Filières Métiers & Finance',
    nameEn: 'Industry Careers & Finance',
    descFr: 'Des cursus spécialisés en audit financier, contrôle de gestion, logistique et gouvernance d\'entreprise.',
    descEn: 'Specialized programs in financial audit, management control, logistics, and corporate governance.'
  },
  'langues': {
    nameFr: 'Centre de Langues & Certifications',
    nameEn: 'Language Center & Certifications',
    descFr: 'Renforcez vos compétences linguistiques pour le commerce international et validez votre score TOEIC / TOEFL.',
    descEn: 'Strengthen your language skills for global business and achieve official TOEIC / TOEFL scores.'
  }
}

export default function FormationDetail() {
  const { t, language } = useLanguage()
  const params = useParams()
  const slug = params?.slug as string
  
  const [isCategory, setIsCategory] = useState(false)
  const [categoryFormations, setCategoryFormations] = useState<any[]>([])
  const [formation, setFormation] = useState<any>(null)
  
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    pays: '',
    ville: '',
    message: '',
    contactPreference: 'email'
  })
  const [formLoading, setFormLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!slug) return
    
    setLoading(true)
    const dbCategory = slugToDbCategory[slug]
    
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        const list: any[] = data.formations || []
        
        if (dbCategory) {
          // It's a category page
          const filtered = list.filter(
            (f: any) => (f.categorie || '').toLowerCase().includes(dbCategory.toLowerCase()) || dbCategory.toLowerCase().includes((f.categorie || '').toLowerCase())
          )
          setCategoryFormations(filtered)
          setIsCategory(true)
        } else {
          // It's an individual formation page
          // First check in the loaded list
          let found = list.find(
            (f: any) => String(f.id) === slug || (f.titre || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') === slug
          )
          // If not in API list, check directly in FORMATIONS_CATALOG
          if (!found) {
            found = FORMATIONS_CATALOG.find(
              c => c.id === slug || c.titre.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') === slug
            )
          }
          setFormation(found || null)
          setIsCategory(false)
        }
      })
      .catch(err => {
        console.error('Erreur chargement formation:', err)
        // Fallback for formation lookup
        const found = FORMATIONS_CATALOG.find(c => c.id === slug)
        if (found) {
          setFormation(found)
          setIsCategory(false)
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleOpenForm = (f: any) => {
    setSelectedFormation(f)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormation) return
    
    setFormLoading(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'inscription',
          formationTitre: selectedFormation.titre,
          date: new Date().toISOString()
        })
      })

      const adminEmail = 'Formations@conseiluxtraining.com'
      const adminWhatsApp = '+228 90 54 64 64'
      
      if (formData.contactPreference === 'whatsapp') {
        const message = `Nouvelle demande de formation:%0A- Nom: ${formData.nom}%0A- Email: ${formData.email}%0A- Téléphone: ${formData.telephone}%0A- Formation: ${selectedFormation.titre}%0A- Entreprise: ${formData.entreprise || 'N/A'}`
        window.open(`https://wa.me/22890546464?text=${message}`, '_blank')
      } else {
        const emailSubject = `Inscription: ${formData.nom} - ${selectedFormation.titre}`
        const emailBody = `Nouvelle inscription reçue:\nNom: ${formData.nom}\nEmail: ${formData.email}\nTéléphone: ${formData.telephone}\nEntreprise: ${formData.entreprise || 'Non spécifié'}\nFormation: ${selectedFormation.titre}\nMessage: ${formData.message || 'Aucun'}`
        window.open(`mailto:${adminEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, '_blank')
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setShowForm(false)
        setSelectedFormation(null)
      }, 3000)
    } catch {
      alert(language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
        </main>
        <Footer />
      </div>
    )
  }

  // ──────────────────────────────────────────
  // VUE 1 : PAGE DE CATÉGORIE
  // ──────────────────────────────────────────
  if (isCategory) {
    const meta = categoryMetadata[slug] || {
      nameFr: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      nameEn: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      descFr: 'Découvrez l\'ensemble de nos formations d\'excellence dans ce domaine.',
      descEn: 'Discover all our executive and certified trainings in this domain.'
    }
    
    const categoryTitle = language === 'fr' ? meta.nameFr : meta.nameEn
    const categoryDesc = language === 'fr' ? meta.descFr : meta.descEn

    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <Header />
        <main className="flex-grow">
          {/* Header Catégorie */}
          <section className="py-14 md:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <Link href="/" className="hover:text-orange-600">
                  {language === 'fr' ? 'Accueil' : 'Home'}
                </Link>
                <span>/</span>
                <Link href="/formations" className="hover:text-orange-600">
                  {language === 'fr' ? 'Formations' : 'Trainings'}
                </Link>
                <span>/</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{categoryTitle}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                {categoryTitle}
              </h1>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {categoryDesc}
              </p>
            </div>
          </section>

          {/* Liste des formations de la catégorie */}
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              {categoryFormations.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto shadow-xs">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                    {language === 'fr' 
                      ? 'Aucune formation enregistrée pour le moment dans cette thématique.' 
                      : 'No training currently recorded for this category.'}
                  </p>
                  <Link 
                    href="/contact" 
                    className="btn-primary text-xs"
                  >
                    {language === 'fr' ? 'Demander une formation sur-mesure' : 'Request customized training'}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {categoryFormations.map((item) => {
                    const img = getFormationImage(item)
                    return (
                      <article 
                        key={item.id} 
                        className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                      >
                        <div>
                          <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                              src={img}
                              alt={item.titre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            {item.certifiante && (
                              <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-md">
                                  <Award className="w-3 h-3" />
                                  <span>{language === 'fr' ? 'Certifiante' : 'Certified'}</span>
                                </span>
                              </div>
                            )}

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                              <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md">
                                <Clock className="w-3.5 h-3.5 text-orange-400" />
                                <span>{item.duree || '5 jours'}</span>
                              </span>
                              <span className="font-bold text-white bg-orange-600/90 px-2.5 py-1 rounded-md text-[11px]">
                                {item.prix || (language === 'fr' ? 'Sur devis' : 'On quote')}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-2 leading-snug">
                              {item.titre}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-3 mb-4">
                              {item.description}
                            </p>

                            {item.objectif && (
                              <div className="mb-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/40 rounded-xl p-3">
                                <h4 className="text-[11px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-1">
                                  {language === 'fr' ? 'Objectif clé' : 'Key Objective'}
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-2">{item.objectif}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex gap-2">
                          <Link
                            href={`/formations/${item.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
                          >
                            <span>{language === 'fr' ? 'Programme' : 'Curriculum'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenForm(item)}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs shadow-orange-600/20 transition-all cursor-pointer"
                          >
                            <span>{language === 'fr' ? 'S\'inscrire' : 'Enroll'}</span>
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />

        {/* Modal d'inscription */}
        {showForm && selectedFormation && (
          <RegistrationModal 
            success={success}
            formLoading={formLoading}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            onClose={() => { setShowForm(false); setSelectedFormation(null); }}
            formationTitre={selectedFormation.titre}
            language={language}
          />
        )}
      </div>
    )
  }

  // ──────────────────────────────────────────
  // VUE 2 : FORMATION NON TROUVÉE
  // ──────────────────────────────────────────
  if (!formation) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {language === 'fr' ? 'Formation non trouvée' : 'Training not found'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              {language === 'fr'
                ? 'Cette formation n\'existe pas ou a été déplacée.'
                : 'This training course does not exist or has been moved.'}
            </p>
            <Link href="/formations" className="btn-primary text-xs">
              {language === 'fr' ? 'Retourner au catalogue' : 'Back to catalog'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ──────────────────────────────────────────
  // VUE 3 : DÉTAIL COMPLET D'UNE FORMATION (STYLE MYCONNECTING)
  // ──────────────────────────────────────────
  const heroImg = getFormationImage(formation)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* En-tête de la fiche de formation */}
        <section className="relative py-12 md:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
              <Link href="/" className="hover:text-orange-600">
                {language === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <Link href="/formations" className="hover:text-orange-600">
                {language === 'fr' ? 'Formations' : 'Trainings'}
              </Link>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
                {formation.titre}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
                    {formation.categorie}
                  </span>
                  {formation.certifiante && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>{formation.certificationName || (language === 'fr' ? 'Formation Certifiante' : 'Certified Training')}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-snug">
                  {formation.titre}
                </h1>

                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {formation.description}
                </p>

                {/* Métriques clés */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mb-1" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{language === 'fr' ? 'Durée' : 'Duration'}</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white">{formation.duree || '5 jours'}</strong>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{language === 'fr' ? 'Modalité' : 'Format'}</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white">{formation.modalite ? formation.modalite.split('&')[0].trim() : 'Présentiel & Visio'}</strong>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl">
                    <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{language === 'fr' ? 'Évaluation' : 'Assessment'}</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white">{formation.certifiante ? (language === 'fr' ? 'Examen certifiant' : 'Certified exam') : (language === 'fr' ? 'Attestation' : 'Certificate')}</strong>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl">
                    <span className="text-lg block mb-1">💰</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{language === 'fr' ? 'Tarif' : 'Tuition'}</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white">{formation.prix || (language === 'fr' ? 'Sur devis' : 'On quote')}</strong>
                  </div>
                </div>
              </div>

              {/* Photo d'en-tête (Desktop) */}
              <div className="lg:col-span-4 hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 aspect-4/3 bg-slate-100">
                  <img
                    src={heroImg}
                    alt={formation.titre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corps de la page : Contenu + Sticky Sidebar */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Colonne Principale (Contenu Pédagogique) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Objectifs pédagogiques */}
                {formation.objectif && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        {language === 'fr' ? 'Objectifs pédagogiques' : 'Learning Objectives'}
                      </h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                      {formation.objectif}
                    </p>
                  </div>
                )}

                {/* 2. Programme détaillé module par module */}
                {formation.modules && formation.modules.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                          {language === 'fr' ? 'Programme de la formation' : 'Course Curriculum'}
                        </h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formation.modules.length} {language === 'fr' ? 'modules structurés' : 'structured modules'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {formation.modules.map((mod: string, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750 transition-all hover:bg-orange-50/50 dark:hover:bg-slate-800"
                        >
                          <span className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                              {mod}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Points forts de la formation */}
                {formation.pointsForts && formation.pointsForts.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        {language === 'fr' ? 'Les atouts Conseilux Training' : 'Key Advantages'}
                      </h2>
                    </div>

                    <ul className="space-y-3">
                      {formation.pointsForts.map((pt: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                          <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Public cible & Prérequis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formation.publicCible && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span>{language === 'fr' ? 'Public concerné' : 'Target Audience'}</span>
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {formation.publicCible}
                      </p>
                    </div>
                  )}

                  {formation.prerequis && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>{language === 'fr' ? 'Prérequis' : 'Prerequisites'}</span>
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {formation.prerequis}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Colonne Latérale Sticky (Inscription & Contact) */}
              <div className="lg:col-span-4 sticky top-20 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                  {/* Photo en vignette */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={heroImg}
                      alt={formation.titre}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                      {formation.categorie}
                    </div>
                  </div>

                  <div className="mb-5 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      {language === 'fr' ? 'Tarif par participant :' : 'Price per participant:'}
                    </span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {formation.prix || (language === 'fr' ? 'Sur devis' : 'On quote')}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'fr' ? 'Financement entreprise possible' : 'Corporate financing eligible'}
                    </span>
                  </div>

                  {/* Boutons d'action */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleOpenForm(formation)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-600/20 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <Send className="w-4 h-4" />
                      <span>{language === 'fr' ? 'Demander un devis / S\'inscrire' : 'Enroll / Request a Quote'}</span>
                    </button>

                    <Link
                      href="https://wa.me/22890546464"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{language === 'fr' ? 'Échanger sur WhatsApp' : 'Chat on WhatsApp'}</span>
                    </Link>
                  </div>

                  {/* Garanties */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{language === 'fr' ? 'Formateurs seniors et certifiés' : 'Senior certified instructors'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{language === 'fr' ? 'Attestation officielle remise à l\'issue' : 'Official certificate upon completion'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{language === 'fr' ? 'Support pédagogique complet inclus' : 'Full pedagogical resources included'}</span>
                    </div>
                  </div>
                </div>

                {/* Besoin de conseil */}
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/40 rounded-3xl p-6 text-center">
                  <PhoneCall className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    {language === 'fr' ? 'Besoin d\'un conseil d\'orientation ?' : 'Need training guidance?'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">
                    {language === 'fr' ? 'Nos conseillers pédagogiques répondent à vos questions.' : 'Our academic advisors are here to help.'}
                  </p>
                  <a
                    href="tel:+22890546464"
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    +228 90 54 64 64
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal d'inscription */}
      {showForm && selectedFormation && (
        <RegistrationModal 
          success={success}
          formLoading={formLoading}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setSelectedFormation(null); }}
          formationTitre={selectedFormation.titre}
          language={language}
        />
      )}
    </div>
  )
}

// Composant Réutilisable Modal Inscription
function RegistrationModal({
  success,
  formLoading,
  formData,
  setFormData,
  handleSubmit,
  onClose,
  formationTitre,
  language
}: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 max-h-[92vh] overflow-y-auto text-slate-800 dark:text-white shadow-2xl">
        <div className="flex justify-between items-start mb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              {language === 'fr' ? 'Inscription & Devis' : 'Enrollment & Quote'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {formationTitre}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full text-xl leading-none"
          >
            ×
          </button>
        </div>

        {success && (
          <div className="mb-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              {language === 'fr' 
                ? 'Inscription reçue avec succès ! Un conseiller vous recontactera sous 24h.' 
                : 'Registration received! An advisor will reach back within 24h.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              {language === 'fr' ? 'Nom et prénom *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                {language === 'fr' ? 'Email *' : 'Email *'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@exemple.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                {language === 'fr' ? 'Téléphone / WhatsApp *' : 'Phone / WhatsApp *'}
              </label>
              <input
                type="tel"
                required
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+228 90 00 00 00"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              {language === 'fr' ? 'Entreprise' : 'Company'}
            </label>
            <input
              type="text"
              value={formData.entreprise}
              onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
              placeholder={language === 'fr' ? 'Nom de votre entreprise' : 'Your company name'}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                {language === 'fr' ? 'Pays' : 'Country'}
              </label>
              <input
                type="text"
                value={formData.pays}
                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                placeholder="Togo, Bénin..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                {language === 'fr' ? 'Ville' : 'City'}
              </label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                placeholder="Lomé, Cotonou..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              {language === 'fr' ? 'Message ou questions particulières' : 'Message or questions'}
            </label>
            <textarea
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={language === 'fr' ? 'Précisez votre demande...' : 'Specify your request...'}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
              {language === 'fr' ? 'Préférence de contact *' : 'Contact preference *'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactPreference: 'email' })}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formData.contactPreference === 'email'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactPreference: 'whatsapp' })}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formData.contactPreference === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 text-sm shadow-md shadow-orange-600/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {formLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'fr' ? 'Envoi...' : 'Sending...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{language === 'fr' ? 'Confirmer l\'inscription' : 'Confirm Registration'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}