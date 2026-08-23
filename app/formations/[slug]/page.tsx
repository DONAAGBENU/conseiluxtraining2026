"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { CheckCircle, Clock, Loader2, Mail, MessageSquare, Send, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/app/components/LanguageProvider'

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
    descFr: 'Formez vos équipes aux technologies de demain',
    descEn: 'Train your teams in the technologies of tomorrow'
  },
  'technologie-numerique': {
    nameFr: 'Technologies Numériques & Cybersécurité',
    nameEn: 'Digital Technologies & Cybersecurity',
    descFr: 'Formez vos équipes aux technologies de demain',
    descEn: 'Train your teams in the technologies of tomorrow'
  },
  'gestion-projet': {
    nameFr: 'Gestion de Projet',
    nameEn: 'Project Management',
    descFr: 'Pilotez vos projets avec agilité et efficacité',
    descEn: 'Manage your projects with agility and efficiency'
  },
  'management-leadership': {
    nameFr: 'Management et Leadership',
    nameEn: 'Management & Leadership',
    descFr: 'Développez votre posture de leader et managez vos équipes',
    descEn: 'Develop your leadership stance and manage your teams'
  },
  'performance-commerciale': {
    nameFr: 'Performance Commerciale',
    nameEn: 'Commercial Performance',
    descFr: 'Optimisez vos ventes et fidélisez vos clients',
    descEn: 'Optimize your sales and build customer loyalty'
  },
  'filieres-metiers': {
    nameFr: 'Filières Métiers',
    nameEn: 'Career Paths',
    descFr: 'Des formations spécialisées pour chaque secteur d\'activité',
    descEn: 'Specialized training for each business sector'
  },
  'langues': {
    nameFr: 'Langues',
    nameEn: 'Languages',
    descFr: 'Renforcez vos compétences linguistiques pour l\'international',
    descEn: 'Strengthen your language skills for international business'
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
    contactPreference: 'email' // 'email' or 'whatsapp'
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
        const list = data.formations || []
        
        if (dbCategory) {
          // 1. C'est une catégorie
          const filtered = list.filter(
            (f: any) => f.categorie.toLowerCase() === dbCategory.toLowerCase()
          )
          setCategoryFormations(filtered)
          setIsCategory(true)
        } else {
          // 2. C'est un détail de formation
          const found = list.find(
            (f: any) => f.id === slug || f.titre.toLowerCase().replace(/ /g, '-') === slug
          )
          setFormation(found || null)
          setIsCategory(false)
        }
      })
      .catch(err => {
        console.error(
          language === 'fr' 
            ? 'Erreur lors du chargement des données :' 
            : 'Error loading data:', 
          err
        )
      })
      .finally(() => setLoading(false))
  }, [slug, language])

  const handleOpenForm = (f: any) => {
    setSelectedFormation(f)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormation) return
    
    setFormLoading(true)

    try {
      // Save lead data
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'inscription',
          formationTitre: selectedFormation.titre,
          date: new Date().toISOString()
        })
      })

      if (res.ok) {
        // Send notification to admin based on contact preference
        const adminEmail = 'Formations@conseiluxtraining.com'
        const adminWhatsApp = '+228 90 54 64 64'
        
        if (formData.contactPreference === 'email') {
          // Send email notification to admin
          const emailSubject = `Nouvelle inscription: ${formData.nom} - ${selectedFormation.titre}`
          const emailBody = `
Nouvelle inscription reçue:

Nom: ${formData.nom}
Email: ${formData.email}
Téléphone: ${formData.telephone}
Entreprise: ${formData.entreprise || 'Non spécifié'}
Pays: ${formData.pays || 'Non spécifié'}
Ville: ${formData.ville || 'Non spécifié'}
Formation: ${selectedFormation.titre}
Message: ${formData.message || 'Aucun message'}
Date: ${new Date().toLocaleString('fr-FR')}

Contact préférence: Email
          `
          
          // Open email client with pre-filled message to admin
          const mailtoUrl = `mailto:${adminEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
          window.open(mailtoUrl, '_blank')
          
          setSuccess(true)
        } else if (formData.contactPreference === 'whatsapp') {
          // Send WhatsApp notification to admin
          const message = `Nouvelle inscription reçue:%0A%0ANom: ${formData.nom}%0AEmail: ${formData.email}%0ATéléphone: ${formData.telephone}%0AFormation: ${selectedFormation.titre}%0AMessage: ${formData.message || 'Aucun'}%0A%0ADate: ${new Date().toLocaleString('fr-FR')}`
          const cleanWhatsApp = adminWhatsApp.replace(/[^0-9]/g, '')
          const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${message}`
          
          // Open WhatsApp with pre-filled message to admin
          window.open(whatsappUrl, '_blank')
          
          setSuccess(true)
        }

        // Track form submission in analytics
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'form_submission',
            page: `/formations/${slug}`,
            metadata: {
              formation: selectedFormation.titre,
              user_email: formData.email,
              user_name: formData.nom,
              contact_preference: formData.contactPreference,
              timestamp: new Date().toISOString()
            }
          })
        })

        setSuccess(true)
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          entreprise: '',
          pays: '',
          ville: '',
          message: '',
          contactPreference: 'email'
        })
        setTimeout(() => {
          setSuccess(false)
          setShowForm(false)
          setSelectedFormation(null)
        }, 3000)
      } else {
        alert(language === 'fr' ? 'Erreur lors de l\'inscription' : 'Error during registration')
      }
    } catch (err) {
      alert(language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-800" />
        </main>
        <Footer />
      </div>
    )
  }

  // Si c'est une page de catégorie
  if (isCategory) {
    const meta = categoryMetadata[slug] || {
      nameFr: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      nameEn: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      descFr: 'Découvrez toutes nos formations.',
      descEn: 'Discover all our training courses.'
    }
    
    const categoryTitle = language === 'fr' ? meta.nameFr : meta.nameEn
    const categoryDesc = language === 'fr' ? meta.descFr : meta.descEn

    return (
      <div className="min-h-screen flex flex-col text-white">
        <Header />
        <main className="flex-grow">
          <section className="py-20 bg-gradient-to-r from-primary to-dark text-white text-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold">{categoryTitle}</h1>
              <p className="text-xl text-orange-800 mt-4 max-w-2xl mx-auto">
                {categoryDesc}
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              {categoryFormations.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl max-w-xl mx-auto">
                  <p className="text-orange-800/60 mb-6">{t.formations.noFormations}</p>
                  <Link 
                    href="/contact" 
                    className="inline-flex bg-orange-800 hover:bg-orange-700 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-orange-800/10 text-sm"
                  >
                    {language === 'fr' ? 'Nous contacter' : 'Contact Us'}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryFormations.map((item) => (
                    <div 
                      key={item.id} 
                      className="card border-t-4 border-orange-800 bg-white/10 backdrop-blur-md border-white/10 hover:-translate-y-1 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.titre}</h3>
                        <p className="text-xs text-orange-800 mb-3">{item.categorie}</p>
                        <p className="text-orange-800/80 text-sm mb-4 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                        
                        <div className="space-y-2 text-xs text-orange-800/60 mb-6">
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-orange-800" />
                            <span>{t.formations.duration}: <strong>{item.duree}</strong></span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="text-sm">💰</span>
                            <span>{t.formations.price}: <strong>{item.prix}</strong></span>
                          </p>
                          {item.certifiante && (
                            <p className="text-green-400 flex items-center gap-1.5 font-medium">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span>{t.formations.certified}</span>
                            </p>
                          )}
                        </div>

                        {item.objectif && (
                          <div className="mb-4 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                            <h4 className="text-xs font-semibold text-orange-400 mb-1">Objectif</h4>
                            <p className="text-orange-800/80 text-xs line-clamp-2">{item.objectif}</p>
                          </div>
                        )}

                        {item.prerequis && (
                          <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                            <h4 className="text-xs font-semibold text-blue-400 mb-1">Pré-requis</h4>
                            <p className="text-orange-800/80 text-xs line-clamp-2">{item.prerequis}</p>
                          </div>
                        )}

                        {item.modules && item.modules.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">{t.formations.modules}</h4>
                            <ul className="space-y-1">
                              {item.modules.slice(0, 3).map((mod: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5 text-xs text-orange-800/80">
                                  <CheckCircle className="w-3.5 h-3.5 text-orange-800 shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{mod}</span>
                                </li>
                              ))}
                              {item.modules.length > 3 && (
                                <li className="text-[10px] text-orange-800/40 pl-5">
                                  +{item.modules.length - 3} {language === 'fr' ? 'autres...' : 'more...'}
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleOpenForm(item)}
                          className="flex-1 bg-orange-800 hover:bg-orange-700 text-white py-2 rounded-xl text-xs font-semibold shadow-md shadow-orange-800/10 text-center transition-colors"
                        >
                          {t.formations.enroll}
                        </button>
                        <Link
                          href={`/formations/${item.id}`}
                          className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                        >
                          {t.formations.viewMore}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
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
            t={t}
            language={language}
          />
        )}
      </div>
    )
  }

  // Si la formation individuelle n'est pas trouvée
  if (!formation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl text-orange-800/60">{language === 'fr' ? 'Formation non trouvée' : 'Training not found'}</p>
        </main>
        <Footer />
      </div>
    )
  }

  // Affichage du détail d'une formation individuelle
  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{formation.titre}</h1>
            <p className="text-xl text-orange-800 mt-4">{formation.categorie}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="card border-t-4 border-primary bg-white/10 backdrop-blur-md border-white/10">
              <p className="text-orange-800/90 text-lg leading-relaxed">{formation.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <Clock className="w-6 h-6 text-orange-800 mx-auto" />
                  <p className="text-xs text-orange-800/50 mt-1">{t.formations.duration}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{formation.duree}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-2xl">💰</span>
                  <p className="text-xs text-orange-800/50 mt-1">{t.formations.price}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{formation.prix}</p>
                </div>
                {formation.certifiante && (
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    <p className="text-xs text-green-400/55 mt-1">{t.formations.certified}</p>
                    <p className="text-sm font-semibold text-green-400 mt-0.5">{language === 'fr' ? 'Oui' : 'Yes'}</p>
                  </div>
                )}
              </div>

              {formation.objectif && (
                <div className="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                  <h3 className="font-bold text-orange-400 mb-2 text-lg">Objectif de la formation</h3>
                  <p className="text-orange-800/90 text-sm leading-relaxed">{formation.objectif}</p>
                </div>
              )}

              {formation.prerequis && (
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                  <h3 className="font-bold text-blue-400 mb-2 text-lg">Pré-requis</h3>
                  <p className="text-orange-800/90 text-sm leading-relaxed">{formation.prerequis}</p>
                </div>
              )}

              {formation.modules && formation.modules.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-white mb-3 text-lg">{t.formations.modules}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formation.modules.map((module: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-orange-800 flex-shrink-0 mt-0.5" />
                        <span className="text-orange-800/90 text-sm">{module}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                onClick={() => handleOpenForm(formation)}
                className="mt-8 inline-block bg-orange-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-800/10 text-sm"
              >
                {t.formations.enroll}
              </button>
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
          t={t}
          language={language}
        />
      )}
    </div>
  )
}

// Composant réutilisable pour le Modal d'inscription
function RegistrationModal({
  success,
  formLoading,
  formData,
  setFormData,
  handleSubmit,
  onClose,
  formationTitre,
  t,
  language
}: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">{language === 'fr' ? 'Inscription' : 'Registration'} - {formationTitre}</h2>
          <button 
            onClick={onClose} 
            className="text-orange-800/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all text-xl"
          >
            ×
          </button>
        </div>

        {success && (
          <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 animate-bounce" />
            <p className="text-green-400 text-sm font-medium">
              {language === 'fr' 
                ? 'Inscription envoyée avec succès ! Nous vous contacterons bientôt.' 
                : 'Registration sent successfully! We will contact you soon.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-800 mb-2">{t.contact.name} *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
              placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">{t.contact.email} *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">{t.contact.phone} *</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                placeholder="+228 90 54 64 64"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-800 mb-2">{language === 'fr' ? 'Entreprise' : 'Company'}</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
              placeholder={language === 'fr' ? 'Nom de votre entreprise' : 'Your company name'}
              value={formData.entreprise}
              onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">{language === 'fr' ? 'Pays' : 'Country'}</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                placeholder={language === 'fr' ? 'ex: Togo' : 'e.g. Togo'}
                value={formData.pays}
                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">{language === 'fr' ? 'Ville' : 'City'}</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
                placeholder={language === 'fr' ? 'ex: Lomé' : 'e.g. Lome'}
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-800 mb-2">{language === 'fr' ? 'Message (optionnel)' : 'Message (optional)'}</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition-all"
              placeholder={language === 'fr' ? 'Questions supplémentaires...' : 'Additional questions...'}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-800 mb-3">{language === 'fr' ? 'Préférence de contact *' : 'Contact preference *'}</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactPreference: 'email' })}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.contactPreference === 'email'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <Mail className="w-6 h-6 text-orange-800" />
                <span className="text-sm font-medium">Email</span>
                <span className="text-xs text-orange-800/50">Formations@conseiluxtraining.com</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactPreference: 'whatsapp' })}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.contactPreference === 'whatsapp'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <MessageSquare className="w-6 h-6 text-green-400" />
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-xs text-orange-800/50">+228 90 54 64 64</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-800 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-700 disabled:bg-orange-800/50 disabled:cursor-not-allowed transition-colors mt-4"
          >
            {formLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {language === 'fr' ? 'Envoyer mon inscription' : 'Send my registration'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}