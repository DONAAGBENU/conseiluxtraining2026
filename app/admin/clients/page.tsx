'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MessageSquare, Loader2, Search, Globe, MapPin, Building, Calendar, Plus, Edit, Trash2, X } from 'lucide-react'

interface Client {
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

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'inscription' | 'catalogue'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    pays: '',
    ville: '',
    source: 'catalogue',
    formationTitre: '',
    message: '',
    contactPreference: 'email'
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch('/api/leads', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error(`Erreur HTTP ${res.status} lors du chargement des clients:`, errorText)
        setClients([])
        return
      }
      
      const data = await res.json()
      setClients(data.leads || [])
    } catch (err) {
      console.error('Erreur lors du chargement des clients:', err)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const getWhatsAppUrl = (phone: string, name: string, formationTitre?: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      let res
      if (editMode && editingId) {
        // Update existing client
        res = await fetch(`/api/leads/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        // Create new client
        res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            date: new Date().toISOString()
          })
        })
      }

      if (res.ok) {
        await fetchClients()
        setShowForm(false)
        setEditMode(false)
        setEditingId(null)
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          entreprise: '',
          pays: '',
          ville: '',
          source: 'catalogue',
          formationTitre: '',
          message: '',
          contactPreference: 'email'
        })
      } else {
        alert(editMode ? "Erreur lors de la modification du client" : "Erreur lors de la création du client")
      }
    } catch {
      alert("Une erreur est survenue")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (client: Client) => {
    setFormData({
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      entreprise: client.entreprise || '',
      pays: client.pays || '',
      ville: client.ville || '',
      source: client.source,
      formationTitre: client.formationTitre || '',
      message: client.message || '',
      contactPreference: client.contactPreference || 'email'
    })
    setEditingId(client.id)
    setEditMode(true)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        const res = await fetch(`/api/leads/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          await fetchClients()
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch {
        alert('Une erreur est survenue')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      entreprise: '',
      pays: '',
      ville: '',
      source: 'catalogue',
      formationTitre: '',
      message: '',
      contactPreference: 'email'
    })
    setEditMode(false)
    setEditingId(null)
    setShowForm(false)
  }

  const filteredClients = clients
    .filter(client => {
      if (filter === 'all') return true
      return client.source === filter
    })
    .filter(client => {
      const query = searchQuery.toLowerCase()
      return (
        client.nom.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.telephone.includes(query) ||
        (client.entreprise && client.entreprise.toLowerCase().includes(query)) ||
        (client.formationTitre && client.formationTitre.toLowerCase().includes(query)) ||
        (client.pays && client.pays.toLowerCase().includes(query)) ||
        (client.ville && client.ville.toLowerCase().includes(query))
      )
    })

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Clients</h1>
          <p className="text-orange-800/80 text-sm mt-1">Gérez les informations de vos clients et prospects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-800 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg shadow-orange-600/10"
        >
          <Plus className="w-5 h-5" />
          Ajouter un client
        </button>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex bg-black/25 p-1 rounded-2xl border border-white/5 w-full lg:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === 'all' ? 'bg-orange-800 text-white shadow' : 'text-orange-800/80 hover:text-white'
            }`}
          >
            Tous ({clients.length})
          </button>
          <button
            onClick={() => setFilter('inscription')}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === 'inscription' ? 'bg-orange-800 text-white shadow' : 'text-orange-800/80 hover:text-white'
            }`}
          >
            Inscriptions ({clients.filter(c => c.source === 'inscription').length})
          </button>
          <button
            onClick={() => setFilter('catalogue')}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === 'catalogue' ? 'bg-orange-800 text-white shadow' : 'text-orange-800/80 hover:text-white'
            }`}
          >
            Catalogues ({clients.filter(c => c.source === 'catalogue').length})
          </button>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-800/70" />
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
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <Search className="w-16 h-16 text-orange-800/40 mx-auto mb-4" />
          <p className="text-orange-800/80 font-medium">Aucun client ne correspond aux critères.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-6">
                <div className="flex-1 space-y-4">
                  {/* Badge de Type et Date */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        client.source === 'inscription'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {client.source === 'inscription' ? '🎓 Inscription formation' : '📖 Téléchargement catalogue'}
                    </span>
                    <span className="text-xs text-orange-800/70 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(client.date).toLocaleString('fr-FR', {
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
                    <h3 className="text-xl font-bold text-white">{client.nom}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-2 gap-x-4 mt-2 text-sm text-orange-800/90">
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="break-all">{client.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                        {client.telephone}
                      </p>
                      {client.entreprise && (
                        <p className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-orange-500 shrink-0" />
                          {client.entreprise}
                        </p>
                      )}
                      {(client.pays || client.ville) && (
                        <p className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>
                            {client.ville}
                            {client.ville && client.pays ? ', ' : ''}
                            {client.pays}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Détails Inscription */}
                  {client.source === 'inscription' && client.formationTitre && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                      <h4 className="font-semibold text-orange-400 text-sm">Formation demandée :</h4>
                      <p className="text-white text-base font-medium mt-1">{client.formationTitre}</p>
                      {client.contactPreference && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-semibold text-orange-400">Préférence de contact :</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            client.contactPreference === 'whatsapp' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {client.contactPreference === 'whatsapp' ? 'WhatsApp' : 'Email'}
                          </span>
                        </div>
                      )}
                      {client.message && (
                        <div className="mt-2 border-t border-orange-500/10 pt-2">
                          <h4 className="font-semibold text-orange-400 text-xs">Message du client :</h4>
                          <p className="text-orange-800 text-sm mt-1 italic">&quot;{client.message}&quot;</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row xl:flex-col gap-3 self-stretch xl:self-center justify-end xl:w-48">
                  <a
                    href={getWhatsAppUrl(client.telephone, client.nom, client.formationTitre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-green-600/10 text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>

                  <a
                    href={getEmailUrl(client.email, client.nom, client.formationTitre)}
                    className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 bg-orange-800 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-orange-600/10 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer E-mail
                  </a>

                  <button
                    onClick={() => handleEdit(client)}
                    className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-blue-600/10 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>

                  <button
                    onClick={() => handleDelete(client.id)}
                    className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-red-600/10 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editMode ? 'Modifier le client' : 'Ajouter un client'}
              </h2>
              <button 
                onClick={resetForm} 
                className="text-orange-800/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">Nom *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom complet"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="+228 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">Entreprise</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  placeholder="Nom de l'entreprise"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">Pays</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    value={formData.pays}
                    onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                    placeholder="Togo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">Ville</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Lomé"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">Source *</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all [&>option]:bg-slate-900"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="catalogue">Téléchargement catalogue</option>
                  <option value="inscription">Inscription formation</option>
                </select>
              </div>

              {formData.source === 'inscription' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Formation</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      value={formData.formationTitre}
                      onChange={(e) => setFormData({ ...formData, formationTitre: e.target.value })}
                      placeholder="Nom de la formation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Préférence de contact</label>
                    <select
                      className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all [&>option]:bg-slate-900"
                      value={formData.contactPreference}
                      onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                    >
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Message</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Message du client..."
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-800 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-700 disabled:bg-orange-800/50 disabled:cursor-not-allowed transition-colors mt-4"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  editMode ? 'Modifier le client' : 'Ajouter le client'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}