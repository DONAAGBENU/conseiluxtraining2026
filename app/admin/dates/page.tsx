'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Loader2, MapPin, Calendar, Clock, Users as UsersIcon } from 'lucide-react'

interface DateFormation {
  id: string
  formationId: string
  formationTitre: string
  lieu: string
  date: string
  duree: string
  places: number
  disponibles: number
  createdAt: string
}

interface Formation {
  id: string
  titre: string
}

export default function AdminDates() {
  const [dates, setDates] = useState<DateFormation[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    formationId: '',
    lieu: '',
    date: '',
    duree: '',
    places: 15,
    disponibles: 15
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resDates, resFormations] = await Promise.all([
        fetch('/api/dates'),
        fetch('/api/formations')
      ])

      const dataDates = await resDates.json()
      const dataFormations = await resFormations.json()

      setDates(dataDates.dates || [])
      setFormations(dataFormations.formations || [])
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    const formation = formations.find(f => f.id === formData.formationId)
    const payload = {
      ...formData,
      formationTitre: formation?.titre || '',
      disponibles: formData.places
    }

    try {
      const res = await fetch('/api/dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        await fetchData()
        setShowForm(false)
        setFormData({ formationId: '', lieu: '', date: '', duree: '', places: 15, disponibles: 15 })
      } else {
        alert("Erreur lors de la création de la session")
      }
    } catch {
      alert("Une erreur est survenue")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette date ?')) {
      try {
        const res = await fetch(`/api/dates/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          await fetchData()
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch {
        alert('Une erreur est survenue')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dates de formation</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg shadow-orange-600/10"
        >
          <Plus className="w-5 h-5" />
          Ajouter une date
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </div>
      ) : dates.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <Calendar className="w-16 h-16 text-orange-200/20 mx-auto mb-4" />
          <p className="text-orange-200/60 font-medium">Aucune date programmée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dates.map((date) => (
            <div 
              key={date.id} 
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all duration-200"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-4">{date.formationTitre}</h3>
                
                <div className="space-y-3 text-sm text-orange-100/70 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    {date.lieu}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                    {date.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                    {date.duree}
                  </p>
                  <p className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-orange-500 shrink-0" />
                    {date.disponibles} / {date.places} places disponibles
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  date.disponibles > 5 
                    ? 'bg-green-500/20 text-green-400' 
                    : date.disponibles > 0 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {date.disponibles > 0 ? 'Disponible' : 'Complet'}
                </span>
                
                <button
                  onClick={() => handleDelete(date.id)}
                  className="p-2 text-red-400 hover:text-white hover:bg-red-600/20 rounded-xl transition-all duration-200 border border-red-500/10"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'ajout */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-8 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Ajouter une date</h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-orange-200/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Formation *</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all [&>option]:bg-slate-900"
                  value={formData.formationId}
                  onChange={(e) => setFormData({ ...formData, formationId: e.target.value })}
                >
                  <option value="">Sélectionnez une formation</option>
                  {formations.map((f) => (
                    <option key={f.id} value={f.id}>{f.titre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Lieu *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  placeholder="ex: Cotonou, Bénin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Date *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="ex: 15-19 Septembre 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Durée</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.duree}
                  onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                  placeholder="ex: 5 jours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Nombre de places</label>
                <input
                  type="number"
                  required
                  min={1}
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.places}
                  onChange={(e) => setFormData({ ...formData, places: parseInt(e.target.value) || 15 })}
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-500 disabled:bg-orange-600/50 disabled:cursor-not-allowed transition-colors mt-4"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  'Ajouter la session'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
