"use client"

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { 
  CheckCircle, Clock, Loader2, Mail, MessageSquare, Send, 
  ChevronRight, Award, Users, BookOpen, ArrowLeft, ShieldCheck, 
  PhoneCall, Download, Check, Sparkles, Calendar, MapPin, 
  ChevronDown, ChevronUp, FileText, CheckCircle2, Target, 
  Layers, HelpCircle, Info, ExternalLink, GraduationCap,
  Building2, UserCheck, Flame
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/app/components/LanguageProvider'
import { getFormationImage } from '@/app/data/formationsData'
import { parseModules, parseObjectifs, parsePrerequis } from '@/lib/formationFormatter'
import { normalizeFormationSections, RichText, RichTextInline } from '@/lib/RichText'

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
  const rawSlug = (params?.slug as string) || ''
  
  const [isCategory, setIsCategory] = useState(false)
  const [categoryFormations, setCategoryFormations] = useState<any[]>([])
  const [formation, setFormation] = useState<any>(null)
  const [dates, setDates] = useState<any[]>([])
  
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  
  const [activeTab, setActiveTab] = useState<'presentation' | 'objectifs' | 'programme' | 'prerequis' | 'sessions'>('presentation')
  const sectionNavRef = useRef<HTMLDivElement>(null)
  const [openModules, setOpenModules] = useState<{ [key: number]: boolean }>({ 1: true, 2: true })
  const [allExpanded, setAllExpanded] = useState(false)

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    pays: '',
    ville: '',
    sessionDate: '',
    message: '',
    contactPreference: 'email'
  })
  const [formLoading, setFormLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const normalize = (str: string) => 
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  useEffect(() => {
    if (!rawSlug) return
    
    setLoading(true)
    const dbCategory = slugToDbCategory[rawSlug]
    
    Promise.all([
      fetch('/api/formations', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/dates', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ dates: [] }))
    ])
      .then(([formationsData, datesData]) => {
        const list: any[] = formationsData.formations || []
        const allDates: any[] = datesData.dates || []
        
        if (dbCategory) {
          // It's a category page
          const filtered = list.filter(
            (f: any) => (f.categorie || '').toLowerCase().includes(dbCategory.toLowerCase()) || dbCategory.toLowerCase().includes((f.categorie || '').toLowerCase())
          )
          setCategoryFormations(filtered)
          setIsCategory(true)
        } else {
          // It's an individual formation page
          const currentSlugNorm = normalize(rawSlug)
          const found = list.find((f: any) => {
            if (String(f.id) === rawSlug) return true
            const fSlug = normalize(f.titre || '')
            return fSlug === currentSlugNorm || currentSlugNorm.includes(fSlug) || fSlug.includes(currentSlugNorm)
          })
          
          setFormation(found || null)
          setIsCategory(false)

          if (found) {
            const courseDates = allDates.filter(
              (d: any) => d.formationId === found.id || normalize(d.formationTitre || '').includes(normalize(found.titre || ''))
            )
            setDates(courseDates)
          }
        }
      })
      .catch(err => {
        console.error('Erreur chargement formation:', err)
        setFormation(null)
        setIsCategory(false)
      })
      .finally(() => setLoading(false))
  }, [rawSlug])

  useEffect(() => {
    if (loading || isCategory || !sectionNavRef.current) return

    const header = document.querySelector('header')
    const sectionNav = sectionNavRef.current
    if (!header) return

    const syncStickyOffset = () => {
      sectionNav.style.top = `${header.getBoundingClientRect().height}px`
    }

    const resizeObserver = new ResizeObserver(syncStickyOffset)
    resizeObserver.observe(header)
    syncStickyOffset()
    return () => resizeObserver.disconnect()
  }, [isCategory, loading])

  useEffect(() => {
    if (loading || !formation) return

    const sectionIds = ['presentation']
    if (formation.objectif?.trim()) sectionIds.push('objectifs')
    if (Array.isArray(formation.modules) && formation.modules.some((module: string) => module.trim())) {
      sectionIds.push('programme')
    }
    if (formation.publicCible?.trim() || formation.prerequis?.trim()) sectionIds.push('prerequis')
    if (dates.length > 0) sectionIds.push('sessions')

    const observer = new IntersectionObserver(() => {
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const navHeight = sectionNavRef.current?.getBoundingClientRect().height ?? 0
      const activationLine = headerHeight + navHeight + 16
      const currentSection = sectionIds
        .map((sectionId) => document.getElementById(sectionId))
        .filter((section): section is HTMLElement =>
          section !== null && section.getBoundingClientRect().top <= activationLine
        )
        .pop()
      if (currentSection) setActiveTab(currentSection.id as typeof activeTab)
    }, { rootMargin: '-170px 0px -55% 0px' })

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [dates.length, formation, loading])

  const toggleModule = (idx: number) => {
    setOpenModules(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const toggleAllModules = (totalCount: number) => {
    if (allExpanded) {
      setOpenModules({})
      setAllExpanded(false)
    } else {
      const next: { [key: number]: boolean } = {}
      for (let i = 1; i <= totalCount; i++) {
        next[i] = true
      }
      setOpenModules(next)
      setAllExpanded(true)
    }
  }

  const handleOpenForm = (f: any, datePreselect?: string) => {
    setSelectedFormation(f)
    if (datePreselect) {
      setSelectedDate(datePreselect)
      setFormData(prev => ({ ...prev, sessionDate: datePreselect }))
    }
    setShowForm(true)
  }

  const scrollToSection = (sectionId: string, tabKey: typeof activeTab) => {
    setActiveTab(tabKey)
    const el = document.getElementById(sectionId)
    if (el) {
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const navHeight = sectionNavRef.current?.getBoundingClientRect().height ?? 0
      const y = window.scrollY + el.getBoundingClientRect().top - headerHeight - navHeight - 16
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
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
      
      if (formData.contactPreference === 'whatsapp') {
        const message = `Nouvelle demande de formation:%0A- Nom: ${formData.nom}%0A- Email: ${formData.email}%0A- Téléphone: ${formData.telephone}%0A- Formation: ${selectedFormation.titre}%0A- Session: ${formData.sessionDate || 'À convenir'}%0A- Entreprise: ${formData.entreprise || 'N/A'}`
        window.open(`https://wa.me/22890546464?text=${message}`, '_blank')
      } else {
        const emailSubject = `Inscription: ${formData.nom} - ${selectedFormation.titre}`
        const emailBody = `Nouvelle inscription reçue:\nNom: ${formData.nom}\nEmail: ${formData.email}\nTéléphone: ${formData.telephone}\nEntreprise: ${formData.entreprise || 'Non spécifié'}\nFormation: ${selectedFormation.titre}\nSession souhaitée: ${formData.sessionDate || 'Non spécifié'}\nMessage: ${formData.message || 'Aucun'}`
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
    const meta = categoryMetadata[rawSlug] || {
      nameFr: rawSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      nameEn: rawSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
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

                              {(item.duree && item.duree !== 'À définir' || item.prix && item.prix !== 'À définir') && <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                                {item.duree && item.duree !== 'À définir' && <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md">
                                <Clock className="w-3.5 h-3.5 text-orange-400" />
                                  <span>{item.duree}</span>
                                </span>}
                                {item.prix && item.prix !== 'À définir' && <span className="font-bold text-white bg-orange-600/90 px-2.5 py-1 rounded-md text-[11px]">{item.prix}</span>}
                              </div>}
                          </div>

                          <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-2 leading-snug">
                              <RichTextInline text={item.titre} />
                            </h3>
                            <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-3 mb-4">
                              <RichTextInline text={item.description} />
                            </p>

                            {item.objectif && (
                              <div className="mb-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/40 rounded-xl p-3">
                                <h4 className="text-[11px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-1">
                                  {language === 'fr' ? 'Objectif clé' : 'Key Objective'}
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-2"><RichTextInline text={item.objectif} /></p>
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
  // VUE 3 : DÉTAIL COMPLET DE LA FORMATION (STYLE OO2 PREMIUM)
  // ──────────────────────────────────────────
  const heroImg = getFormationImage(formation)
  // Parse structured data from database
  const parsedModules = parseModules((formation.modules || []).filter((module: string) => module.trim()))
  const parsedObj = parseObjectifs(formation.objectif || '')
  const parsedPre = parsePrerequis(formation.prerequis || '')
  const formationDuree = formation.duree === 'À définir' ? '' : formation.duree
  const formationPrix = formation.prix === 'À définir' ? '' : formation.prix
  const formationModalite = formation.modalite === 'Présentiel & Visio' ? '' : formation.modalite

  // Fallback high-value points forts if not specified
  const formationSections = normalizeFormationSections(formation.pointsForts)

  const publicCible = formation.publicCible || ''

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* ========================================================= */}
        {/* HERO SECTION D'EN-TÊTE AVEC BANNIÈRE ET FAITS MARQUANTS  */}
        {/* ========================================================= */}
        <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-12 border-b border-slate-800 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            {/* Fil d'Ariane (Breadcrumb) */}
            <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-6">
              <Link href="/" className="hover:text-orange-400 transition-colors">
                {language === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <Link href="/formations" className="hover:text-orange-400 transition-colors">
                {language === 'fr' ? 'Formations' : 'Trainings'}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <Link href={`/formations/${formation.categorie?.toLowerCase().replace(/ /g, '-')}`} className="hover:text-orange-400 transition-colors">
                {formation.categorie}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
                <RichTextInline text={formation.titre} />
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                {/* Badges de certification et catégorie */}
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {formation.categorie?.toUpperCase()}
                  </span>
                  {formation.certificationName && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span><RichTextInline text={formation.certificationName} /></span>
                    </span>
                  )}
                </div>

                {/* Grand Titre de la Formation */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 leading-tight text-white uppercase">
                  <RichTextInline text={formation.titre} />
                </h1>

                {/* Description de présentation */}
                <p className="whitespace-pre-line text-base md:text-lg text-slate-300 leading-relaxed mb-8 max-w-3xl">
                  <RichTextInline text={formation.description} />
                </p>

                {/* Bandeau de faits marquants (Quick Facts façon oo2) */}
                  {(formationDuree || formationModalite || formation.certificationName || formation.certifiante || formationPrix) && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4">
                  {formationDuree && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">DURÉE</span>
                      <strong className="text-xs sm:text-sm font-bold text-white block">{formationDuree}</strong>
                    </div>
                  </div>
                  )}

                  {formationModalite && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">MODALITÉ</span>
                      <strong className="text-xs sm:text-sm font-bold text-white block"><RichTextInline text={formationModalite} /></strong>
                    </div>
                  </div>
                  )}

                  {(formation.certificationName || formation.certifiante) && <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">CERTIFICATION</span>
                      <strong className="text-xs sm:text-sm font-bold text-white block">
                        {formation.certificationName ? <RichTextInline text={formation.certificationName} /> : 'Certifiante'}
                      </strong>
                    </div>
                  </div>
                  }

                  {formationPrix && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">TARIF</span>
                      <strong className="text-xs sm:text-sm font-bold text-white block">{formationPrix}</strong>
                    </div>
                  </div>
                  )}
                </div>}
              </div>

              {/* Photo hero à droite */}
              <div className="lg:col-span-4 hidden lg:block">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/80 aspect-4/3 group">
                  <img
                    src={heroImg}
                    alt={formation.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-orange-600 text-white shadow-lg">
                      CONSEILUX EXECUTIVE TRAINING
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BARRE D'ONGLETS STICKY (Comme sur www.oo2.fr)              */}
        {/* ========================================================= */}
        <div ref={sectionNavRef} className="sticky top-[101px] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center overflow-x-auto no-scrollbar py-2.5 gap-2 text-xs md:text-sm font-semibold">
              <button
                onClick={() => scrollToSection('presentation', 'presentation')}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'presentation'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>PRÉSENTATION</span>
              </button>

              {formation.objectif?.trim() && <button
                onClick={() => scrollToSection('objectifs', 'objectifs')}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'objectifs'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>OBJECTIFS</span>
              </button>}

              {parsedModules.length > 0 && <button
                onClick={() => scrollToSection('programme', 'programme')}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'programme'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>PROGRAMME ({parsedModules.length})</span>
              </button>}

              {(publicCible || parsedPre.generalPrerequis.length > 0 || parsedPre.eligibilityLevels.length > 0) && <button
                onClick={() => scrollToSection('prerequis', 'prerequis')}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'prerequis'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>PUBLIC & PRÉREQUIS</span>
              </button>}

              {dates.length > 0 && (
              <button
                onClick={() => scrollToSection('sessions', 'sessions')}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'sessions'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>DATES & SESSIONS</span>
              </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CORPS DE PAGE : 2 COLONNES (CONTENU + SIDEBAR D'INSCRIPTION) */}
        {/* ========================================================= */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLONNE GAUCHE (8 COLONNES SUR 12) : CONTENU PÉDAGOGIQUE DÉTAILLÉ */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* ───────────────────────────────────────────────────────── */}
                {/* 1. SECTION PRÉSENTATION DE LA FORMATION                   */}
                {/* ───────────────────────────────────────────────────────── */}
                <div id="presentation" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        PRÉSENTATION DE LA FORMATION
                      </h2>
                    </div>
                  </div>

                  {/* Paragraphes de présentation avec vrais retours à la ligne */}
                  <div className="whitespace-pre-line space-y-4 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                    <p className="whitespace-pre-line">
                      <RichTextInline text={formation.description} />
                    </p>
                  </div>

                  {formationSections.length > 0 && <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      INFORMATIONS COMPLÉMENTAIRES
                    </h3>
                    <div className="space-y-4">
                      {formationSections.filter((section) => section.title.trim() || section.content.trim()).map((section, idx) => (
                        <div key={idx} className="border-l-2 border-orange-500 pl-4">
                          {section.title && <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{section.title}</h4>}
                          <RichText content={section.content} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>}
                </div>

                {/* ───────────────────────────────────────────────────────── */}
                {/* 2. SECTION OBJECTIFS PÉDAGOGIQUES                         */}
                {/* ───────────────────────────────────────────────────────── */}
                {formation.objectif?.trim() && <div id="objectifs" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        OBJECTIFS PÉDAGOGIQUES
                      </h2>
                    </div>
                  </div>

                  {/* Intro des objectifs */}
                  {parsedObj.intro && (
                    <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-6 font-medium">
                        <RichTextInline text={parsedObj.intro} />
                    </div>
                  )}

                  {/* Domaines d'objectifs avec TITRES EN MAJUSCULES et puces structurées */}
                  <div className="space-y-6">
                    {parsedObj.domains.map((dom, dIdx) => (
                      <div 
                        key={dIdx} 
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-5 md:p-6"
                      >
                        {(dom.title || dom.percentage) && <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-750">
                          {dom.title && <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" />
                            <RichTextInline text={dom.title} />
                          </h3>}
                          {dom.percentage && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {dom.percentage}
                            </span>
                          )}
                        </div>}

                        {/* Liste des objectifs du domaine avec retour à la ligne garanti */}
                        <ul className="space-y-3">
                          {dom.items.map((it, itIdx) => (
                            <li key={itIdx} className="flex items-start gap-3 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <div className="leading-relaxed">
                                {it.highlight && (
                                  <strong className="text-slate-900 dark:text-white font-semibold capitalize">
                                    <RichTextInline text={it.highlight} /> :{' '}
                                  </strong>
                                )}
                                <span><RichTextInline text={it.text} /></span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>}

                {/* ───────────────────────────────────────────────────────── */}
                {/* 3. SECTION PROGRAMME DÉTAILLÉ (MODULES)                   */}
                {/* ───────────────────────────────────────────────────────── */}
                {parsedModules.length > 0 && <div id="programme" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          PROGRAMME DÉTAILLÉ DE LA FORMATION
                        </h2>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAllModules(parsedModules.length)}
                      className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-850 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all cursor-pointer self-start sm:self-auto"
                    >
                      {allExpanded ? 'Tout réduire' : 'Tout déplier'}
                    </button>
                  </div>

                  {/* Liste des Modules en Accordéon Stylé avec Titres en MAJUSCULES */}
                  <div className="space-y-3.5">
                    {parsedModules.map((mod) => {
                      const isOpen = !!openModules[mod.index]
                      const isExamPrep = mod.title.includes('RÉVISION') || mod.title.includes('EXAMEN')

                      return (
                        <div 
                          key={mod.index} 
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                            isOpen 
                              ? 'border-orange-300/80 dark:border-orange-800/80 bg-white dark:bg-slate-850 shadow-xs' 
                              : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-850'
                          }`}
                        >
                          {/* En-tête du module */}
                          <button
                            onClick={() => toggleModule(mod.index)}
                            className="w-full p-4 md:p-5 flex items-start gap-4 text-left cursor-pointer transition-colors"
                          >
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs ${
                              isExamPrep
                                ? 'bg-purple-600 text-white'
                                : 'bg-orange-600 text-white'
                            }`}>
                              {isExamPrep ? '★' : mod.index}
                            </span>

                            <div className="flex-1">
                              <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                                <RichTextInline text={mod.title} />
                              </h3>
                              {mod.items.length > 0 && !isOpen && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                  {mod.items[0]}
                                </p>
                              )}
                            </div>

                            <div className="text-slate-400 shrink-0 mt-1">
                              {isOpen ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                          </button>

                          {/* Contenu détaillé du module avec retour à la ligne strict */}
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800">
                              {mod.items.length === 0 ? (
                                null
                              ) : (
                                <ul className="space-y-2.5 mt-3">
                                  {mod.items.map((point, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 shrink-0" />
                                      <span className="leading-relaxed"><RichTextInline text={point} /></span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>}

                {/* ───────────────────────────────────────────────────────── */}
                {/* 4. SECTION PUBLIC CIBLE & PRÉREQUIS                       */}
                {/* ───────────────────────────────────────────────────────── */}
                {(publicCible || parsedPre.generalPrerequis.length > 0 || parsedPre.eligibilityLevels.length > 0) && <div id="prerequis" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        PUBLIC VISÉ & PRÉREQUIS
                      </h2>
                    </div>
                  </div>

                  {/* Public concerné */}
                  {publicCible && <div className="mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      PUBLIC CONCERNÉ
                    </h3>
                    <p className="whitespace-pre-line text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {publicCible}
                    </p>
                  </div>}

                  {/* Prérequis pour suivre la formation */}
                  {parsedPre.generalPrerequis.length > 0 && <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      PRÉREQUIS POUR SUIVRE LA FORMATION
                    </h3>
                    <div className="space-y-2.5">
                      {parsedPre.generalPrerequis.map((g, gIdx) => (
                        <div key={gIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                          <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                          <span><RichTextInline text={g} /></span>
                        </div>
                      ))}
                    </div>
                  </div>}

                  {/* Conditions d'éligibilité officielles à l'examen PMP */}
                  {parsedPre.eligibilityLevels.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <RichTextInline text={parsedPre.eligibilityTitle || ''} />
                      </h3>
                      {parsedPre.eligibilityIntro && (
                        <p className="whitespace-pre-line text-xs text-slate-800 dark:text-slate-200 mb-4">
                          <RichTextInline text={parsedPre.eligibilityIntro} />
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                        {parsedPre.eligibilityLevels.map((lvl, lIdx) => (
                          <div 
                            key={lIdx} 
                            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-750 bg-white dark:bg-slate-850 flex flex-col justify-between shadow-2xs"
                          >
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-2 leading-snug">
                              <RichTextInline text={lvl.title} />
                            </h4>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-200 text-xs font-semibold border border-orange-200/60 dark:border-orange-800/60">
                              <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                              <span><RichTextInline text={lvl.experience} /></span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Note CAPM */}
                      {parsedPre.note && (
                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>À savoir : </strong><RichTextInline text={parsedPre.note} /></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>}

                {/* ───────────────────────────────────────────────────────── */}
                {/* 6. SECTION SESSIONS & DATES DE FORMATION                  */}
                {/* ───────────────────────────────────────────────────────── */}
                {dates.length > 0 && <div id="sessions" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        PROCHAINES SESSIONS & CALENDRIER
                      </h2>
                    </div>
                  </div>

                    <div className="space-y-3.5">
                      {dates.map((s, sIdx) => (
                        <div 
                          key={sIdx} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 hover:border-orange-500/50 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                              <strong className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                                {s.date}
                              </strong>
                            </div>
                            {(s.lieu || s.duree || s.disponibles !== undefined && s.disponibles !== null) && <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                              {s.lieu && <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                {s.lieu}
                              </span>}
                              {s.duree && <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {s.duree}
                              </span>}
                              {s.disponibles !== undefined && s.disponibles !== null && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                {s.disponibles} places disponibles
                              </span>}
                            </div>}
                          </div>

                          <button
                            onClick={() => handleOpenForm(formation, `${s.date} (${s.lieu})`)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                          >
                            <span>Réserver cette session</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                </div>}

              </div>

              {/* ========================================================= */}
              {/* COLONNE DROITE (4 COLONNES) : STICKY SIDEBAR D'INSCRIPTION */}
              {/* ========================================================= */}
              <div className="lg:col-span-4 sticky top-24 space-y-6">
                
                {/* Carte Principale d'Action & Tarif */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                  {/* Vignette de la formation */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={heroImg}
                      alt={formation.titre}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white text-xs font-bold uppercase tracking-wider">
                      {formation.categorie}
                    </div>
                  </div>

                  {/* Prix de la formation */}
                  {formationPrix && <div className="mb-5 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
                      TARIF PAR PARTICIPANT :
                    </span>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {formationPrix}
                    </div>
                  </div>}

                  {/* Boutons d'action principaux */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleOpenForm(formation)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <Send className="w-4 h-4" />
                      <span>S'INSCRIRE / DEVIS RAPIDE</span>
                    </button>

                    <Link
                      href="https://wa.me/22890546464"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>ÉCHANGER SUR WHATSAPP</span>
                    </Link>

                    <button
                      onClick={() => window.print()}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Imprimer la fiche</span>
                    </button>
                  </div>

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

// ──────────────────────────────────────────
// COMPOSANT MODAL D'INSCRIPTION & DEVIS
// ──────────────────────────────────────────
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
              {language === 'fr' ? 'Inscription & Devis Officiel' : 'Enrollment & Official Quote'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 uppercase">
              {formationTitre}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full text-xl leading-none cursor-pointer"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                {language === 'fr' ? 'Entreprise / Organisation' : 'Company / Organization'}
              </label>
              <input
                type="text"
                value={formData.entreprise}
                onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                placeholder={language === 'fr' ? 'Nom de votre entreprise' : 'Your company name'}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                {language === 'fr' ? 'Session souhaitée' : 'Desired Session'}
              </label>
              <input
                type="text"
                value={formData.sessionDate}
                onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                placeholder="ex: Octobre 2026 (En ligne)"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
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
                placeholder="Togo, Bénin, Côte d'Ivoire..."
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
                placeholder="Lomé, Cotonou, Abidjan..."
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