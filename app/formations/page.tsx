"use client"

import { useEffect, useState, useMemo } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ChevronRight, Clock, Loader2, Search, CheckCircle, 
  Award, Sparkles, Filter, Send, Mail, MessageSquare, 
  BookOpen, Users, ArrowUpRight, GraduationCap 
} from 'lucide-react'
import { useLanguage } from '@/app/components/LanguageProvider'
import { getFormationImage } from '@/app/data/formationsData'

export default function FormationsList() {
  const { t, language } = useLanguage()
  const [formations, setFormations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [certifiedOnly, setCertifiedOnly] = useState<boolean>(false)

  // Registration Modal
  const [showModal, setShowModal] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState<any>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
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

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        setFormations(data.formations || [])
      })
      .catch(err => {
        console.error('Erreur chargement formations:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Categories list
  const categories = [
    { id: 'all', labelFr: 'Toutes les formations', labelEn: 'All Trainings' },
    { id: 'Technologie numérique', labelFr: 'Technologies & Cyber', labelEn: 'Tech & Cyber' },
    { id: 'Gestion de projet', labelFr: 'Gestion de Projet', labelEn: 'Project Management' },
    { id: 'Management et leadership', labelFr: 'Management & Leadership', labelEn: 'Leadership' },
    { id: 'Performance commerciale', labelFr: 'Performance Commerciale', labelEn: 'Sales & B2B' },
    { id: 'Filières métiers', labelFr: 'Filières Métiers & Finance', labelEn: 'Business & Finance' },
    { id: 'Langues', labelFr: 'Centre de Langues', labelEn: 'Language Center' },
  ]

  // Filtered formations
  const filteredFormations = useMemo(() => {
    return formations.filter(f => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catNorm = (f.categorie || '').toLowerCase()
        const selectedNorm = selectedCategory.toLowerCase()
        if (!catNorm.includes(selectedNorm) && !selectedNorm.includes(catNorm)) {
          return false
        }
      }

      // Certified filter
      if (certifiedOnly && !f.certifiante) {
        return false
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = (f.titre || '').toLowerCase().includes(query)
        const matchDesc = (f.description || '').toLowerCase().includes(query)
        const matchCat = (f.categorie || '').toLowerCase().includes(query)
        const matchModules = Array.isArray(f.modules) && f.modules.some((m: string) => m.toLowerCase().includes(query))
        if (!matchTitle && !matchDesc && !matchCat && !matchModules) {
          return false
        }
      }

      return true
    })
  }, [formations, selectedCategory, certifiedOnly, searchQuery])

  // Count by category
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return formations.length
    const norm = catId.toLowerCase()
    return formations.filter(f => (f.categorie || '').toLowerCase().includes(norm) || norm.includes((f.categorie || '').toLowerCase())).length
  }

  const handleOpenRegister = (formation: any) => {
    setSelectedFormation(formation)
    setShowModal(true)
  }

  const handleSubmitLead = async (e: React.FormEvent) => {
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
        const msg = `Nouvelle inscription:%0A- Nom: ${formData.nom}%0A- Email: ${formData.email}%0A- Tel: ${formData.telephone}%0A- Formation: ${selectedFormation.titre}%0A- Entreprise: ${formData.entreprise || 'Non spécifiée'}`
        window.open(`https://wa.me/22890546464?text=${msg}`, '_blank')
      } else {
        const subject = `Inscription: ${formData.nom} - ${selectedFormation.titre}`
        const body = `Nouvelle inscription reçue:\nNom: ${formData.nom}\nEmail: ${formData.email}\nTéléphone: ${formData.telephone}\nFormation: ${selectedFormation.titre}\nEntreprise: ${formData.entreprise || 'N/A'}\nMessage: ${formData.message || 'N/A'}`
        window.open(`mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
      }

      setFormSuccess(true)
      setTimeout(() => {
        setFormSuccess(false)
        setShowModal(false)
        setSelectedFormation(null)
      }, 3000)
    } catch (err) {
      console.error(err)
      alert(language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section façon MyConnecting */}
        <section className="relative py-14 md:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                {language === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {language === 'fr' ? 'Formations Professionnelles' : 'Professional Trainings'}
              </span>
            </div>

            {/* Badge & Title */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Catalogue Exécutif & Certifications 2026' : 'Executive Catalog & 2026 Certifications'}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                {language === 'fr' ? (
                  <>Développez vos compétences avec <span className="text-orange-600 dark:text-orange-500">nos formations d'élite</span></>
                ) : (
                  <>Empower your talent with <span className="text-orange-600 dark:text-orange-500">our elite training programs</span></>
                )}
              </h1>

              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {language === 'fr'
                  ? 'Des parcours de haute technicité, certifiants et immédiatement applicables en entreprise, dispensés par des experts praticiens chevronnés.'
                  : 'High-level, certified, and instantly actionable executive programs tailored for professional performance and organizational growth.'}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'fr' ? 'Rechercher une formation (ex: CISSP, PMP, ISO 27001, IA, Anglais...)' : 'Search training (e.g. CISSP, PMP, ISO 27001, AI, English...)'}
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm p-1"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {categories.map((cat) => {
                const count = getCategoryCount(cat.id)
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25 scale-[1.02]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 shadow-2xs'
                    }`}
                  >
                    <span>{language === 'fr' ? cat.labelFr : cat.labelEn}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Filter Toggle: Certifiante */}
            <div className="flex justify-center items-center gap-3 mt-5">
              <label className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={certifiedOnly}
                  onChange={(e) => setCertifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{language === 'fr' ? 'Afficher uniquement les formations certifiantes' : 'Show certified trainings only'}</span>
              </label>
            </div>
          </div>
        </section>

        {/* Catalog Grid Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Header row with count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedCategory === 'all'
                    ? (language === 'fr' ? 'Toutes les formations disponibles' : 'All available trainings')
                    : categories.find(c => c.id === selectedCategory)?.[language === 'fr' ? 'labelFr' : 'labelEn']}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {filteredFormations.length} {filteredFormations.length > 1 ? (language === 'fr' ? 'programmes correspondent à vos critères' : 'programs match your criteria') : (language === 'fr' ? 'programme disponible' : 'program available')}
                </p>
              </div>

              {(searchQuery || selectedCategory !== 'all' || certifiedOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setCertifiedOnly(false)
                  }}
                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline self-start sm:self-center"
                >
                  {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === 'fr' ? 'Chargement du catalogue de formations...' : 'Loading trainings catalog...'}
                </p>
              </div>
            ) : filteredFormations.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'fr' ? 'Aucune formation trouvée' : 'No training found'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {language === 'fr'
                    ? 'Aucun programme ne correspond à votre recherche. Essayez d\'autres mots-clés ou réinitialisez les filtres.'
                    : 'No program matches your query. Try different keywords or reset your filters.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setCertifiedOnly(false)
                  }}
                  className="btn-primary text-xs"
                >
                  {language === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredFormations.map((item) => {
                  const imageSrc = getFormationImage(item)
                  return (
                    <article
                      key={item.id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                    >
                      <div>
                        {/* Thumbnail Image Header (MyConnecting style) */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={imageSrc}
                            alt={item.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Category Tag */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-xs border border-white/20">
                              {item.categorie}
                            </span>
                          </div>

                          {/* Certification Badge */}
                          {item.certifiante && (
                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-md">
                                <Award className="w-3 h-3" />
                                <span>{language === 'fr' ? 'Certifiante' : 'Certified'}</span>
                              </span>
                            </div>
                          )}

                          {/* Modality Pill on image bottom */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                            <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md">
                              <Clock className="w-3.5 h-3.5 text-orange-400" />
                              <span>{item.duree || '5 jours'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px]">
                              <Users className="w-3.5 h-3.5 text-blue-400" />
                              <span>{item.modalite ? item.modalite.split('&')[0].trim() : 'Présentiel & Visio'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                          <Link href={`/formations/${item.id}`}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-2.5 leading-snug">
                              {item.titre}
                            </h3>
                          </Link>

                          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2 mb-4">
                            {item.description}
                          </p>

                          {/* Key Modules preview */}
                          {Array.isArray(item.modules) && item.modules.length > 0 && (
                            <div className="mb-4 space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                {language === 'fr' ? 'Au programme :' : 'Key topics:'}
                              </span>
                              {item.modules.slice(0, 2).map((m: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{m}</span>
                                </div>
                              ))}
                              {item.modules.length > 2 && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 pl-5">
                                  +{item.modules.length - 2} {language === 'fr' ? 'autres modules...' : 'more modules...'}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Price Tag */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="text-slate-500 dark:text-slate-400">
                              {language === 'fr' ? 'Tarif entreprise :' : 'Tuition / Price:'}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {item.prix || (language === 'fr' ? 'Sur devis' : 'On quote')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons Footer */}
                      <div className="p-5 pt-0 mt-2 flex items-center gap-2">
                        <Link
                          href={`/formations/${item.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
                        >
                          <span>{language === 'fr' ? 'Détails' : 'Details'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        
                        <button
                          onClick={() => handleOpenRegister(item)}
                          className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs shadow-orange-600/20 transition-all cursor-pointer active:scale-[0.98]"
                        >
                          <span>{language === 'fr' ? 'S\'inscrire' : 'Enroll'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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

      {/* Registration / Quote Modal */}
      {showModal && selectedFormation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 max-h-[92vh] overflow-y-auto text-slate-800 dark:text-white shadow-2xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {language === 'fr' ? 'Demande d\'inscription & Devis' : 'Enrollment & Quote Request'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedFormation.titre}
                </h3>
              </div>
              <button
                onClick={() => { setShowModal(false); setSelectedFormation(null); }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full text-xl leading-none"
              >
                ×
              </button>
            </div>

            {formSuccess && (
              <div className="mb-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                  {language === 'fr'
                    ? 'Votre demande a été enregistrée avec succès ! Notre équipe pédagogique vous contactera sous 24h.'
                    : 'Your request was successfully submitted! Our academic team will contact you within 24 hours.'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  {language === 'fr' ? 'Nom complet *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder={language === 'fr' ? 'Ex: Koffi Mensah' : 'e.g. John Doe'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'fr' ? 'Email professionnel *' : 'Work Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@entreprise.com"
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
                  {language === 'fr' ? 'Entreprise / Organisation' : 'Company / Organization'}
                </label>
                <input
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  placeholder={language === 'fr' ? 'Nom de votre société' : 'Your company name'}
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
                    placeholder={language === 'fr' ? 'Togo, Bénin, Côte d\'Ivoire...' : 'Togo, Benin, Ivory Coast...'}
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
                  {language === 'fr' ? 'Message ou besoins spécifiques' : 'Message or specific needs'}
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={language === 'fr' ? 'Nombre de participants, dates souhaitées, etc.' : 'Number of attendees, target dates, etc.'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                  {language === 'fr' ? 'Comment souhaitez-vous être recontacté ?' : 'How would you like to be contacted?'}
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
                    <span>{language === 'fr' ? 'Envoi en cours...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Envoyer ma demande' : 'Submit Request'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}