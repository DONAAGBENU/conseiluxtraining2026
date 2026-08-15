'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MessageSquare, Loader2, Download, Search, Globe, MapPin, Building, Calendar } from 'lucide-react'

interface Lead {
  id: string
  nom: string
  email: string
  telephone: string
  entreprise: string
  source: string
  date: string
  pays?: string
  ville?: string
  formationTitre?: string
  message?: string
  contactPreference?: string
}

export default function AdminInscriptions() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'inscription' | 'catalogue'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch('/api/leads', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error(`Erreur HTTP ${res.status} lors du chargement des leads:`, errorText)
        setLeads([]) // Set empty array on error to avoid UI breaking
        return
      }
      
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (err) {
      console.error('Erreur lors du chargement des leads/inscriptions:', err)
      setLeads([]) // Set empty array on error to avoid UI breaking
    } finally {
      setLoading(false)
    }
  }

  const getWhatsAppUrl = (phone: string, name: string, formationTitre?: string) => {
    // Supprimer tous les caractères non numériques
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const msg = formationTitre 
      ? `Bonjour ${name}, nous vous contactons suite à votre inscription à la formation "${formationTitre}" sur ConseiluxTraining. Comment pouvons-nous vous aider ?`
      : `Bonjour ${name}, nous vous contactons suite à votre demande de téléchargement du catalogue sur ConseiluxTraining.`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
  }

  const getEmailUrl = (email: string, name: string, formationTitre?: string) => {
    const subject = formationTitre 
      ? `Inscription formation ${formationTitre} - ConseiluxTraining`
      : `Téléchargement Catalogue - ConseiluxTraining`
    const body = `Bonjour ${name},\n\nNous avons bien reçu votre demande sur notre plateforme ConseiluxTraining.\n\nCordialement,\nL'équipe ConseiluxTraining`
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const filteredLeads = leads
    .filter(lead => {
      if (filter === 'all') return true
      return lead.source === filter
    })
    .filter(lead => {
      const query = searchQuery.toLowerCase()
      return (
        lead.nom.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.telephone.includes(query) ||
        (lead.entreprise && lead.entreprise.toLowerCase().includes(query)) ||
        (lead.formationTitre && lead.formationTitre.toLowerCase().includes(query)) ||
        (lead.pays && lead.pays.toLowerCase().includes(query)) ||
        (lead.ville && lead.ville.toLowerCase().includes(query))
      )
    })

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Inscriptions & Téléchargements</h1>
          <p className="text-orange-200/60 text-sm mt-1">Gérez les demandes de contact de vos prospects et clients</p>
        </div>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex bg-black/25 p-1 rounded-2xl border border-white/5 w-full lg:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === 'all' ? 'bg-orange-600 text-white shadow' : 'text-orange-100/60 hover:text-white'
            }`}
          >
            Tous ({leads.length})
          </button>
          <button
            onClick={() => setFilter('inscription')}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === 'inscription' ? 'bg-orange-600 text-white shadow' : 'text-orange-100/60 hover:text-white'
            }`}
          >
            Inscriptions ({leads.filter(l => l.source === 'inscription').length})
          </button>
          <button
            onClick={() => setFilter('catalogue')}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === 'catalogue' ? 'bg-orange-600 text-white shadow' : 'text-orange-100/60 hover:text-white'
            }`}
          >
            Catalogues ({leads.filter(l => l.source === 'catalogue').length})
          </button>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-200/40" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, ville, formation..."
            className="w-full pl-12 pr-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <Search className="w-16 h-16 text-orange-200/20 mx-auto mb-4" />
          <p className="text-orange-200/60 font-medium">Aucune inscription ne correspond aux critères.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-6">
                <div className="flex-1 space-y-4">
                  {/* Badge de Type et Date */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        lead.source === 'inscription'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {lead.source === 'inscription' ? '🎓 Inscription formation' : '📖 Téléchargement catalogue'}
                    </span>
                    <span className="text-xs text-orange-200/40 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(lead.date).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Coordonnées Client */}
                  <div>
                    <h3 className="text-xl font-bold text-white">{lead.nom}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-2 gap-x-4 mt-2 text-sm text-orange-100/70">
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="break-all">{lead.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                        {lead.telephone}
                      </p>
                      {lead.entreprise && (
                        <p className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-orange-500 shrink-0" />
                          {lead.entreprise}
                        </p>
                      )}
                      {(lead.pays || lead.ville) && (
                        <p className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>
                            {lead.ville}
                            {lead.ville && lead.pays ? ', ' : ''}
                            {lead.pays}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Détails Inscription */}
                  {lead.source === 'inscription' && lead.formationTitre && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                      <h4 className="font-semibold text-orange-400 text-sm">Formation demandée :</h4>
                      <p className="text-white text-base font-medium mt-1">{lead.formationTitre}</p>
                      {lead.contactPreference && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-semibold text-orange-400">Préférence de contact :</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            lead.contactPreference === 'whatsapp' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {lead.contactPreference === 'whatsapp' ? 'WhatsApp' : 'Email'}
                          </span>
                        </div>
                      )}
                      {lead.message && (
                        <div className="mt-2 border-t border-orange-500/10 pt-2">
                          <h4 className="font-semibold text-orange-400 text-xs">Message du client :</h4>
                          <p className="text-orange-100/90 text-sm mt-1 italic">&quot;{lead.message}&quot;</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions de Contact */}
                <div className="flex flex-row xl:flex-col gap-3 self-stretch xl:self-center justify-end xl:w-48">
                  <a
                    href={getWhatsAppUrl(lead.telephone, lead.nom, lead.formationTitre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-green-600/10 text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>

                  <a
                    href={getEmailUrl(lead.email, lead.nom, lead.formationTitre)}
                    className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-orange-600/10 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer E-mail
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
