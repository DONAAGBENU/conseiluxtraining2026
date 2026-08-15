'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Loader2, Award, BookOpen, Edit } from 'lucide-react'

interface Formation {
  id: string
  titre: string
  description: string
  categorie: string
  duree: string
  prix: string
  certifiante: boolean
  modules: string[]
  createdAt: string
}

export default function AdminFormations() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    duree: '',
    prix: '',
    certifiante: false,
    modules: ['']
  })

  const categories = [
    'Technologie numérique',
    'Gestion de projet',
    'Management et leadership',
    'Performance commerciale',
    'Filières métiers',
    'Langues'
  ]

  useEffect(() => {
    fetchFormations()
  }, [])

  const fetchFormations = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch('/api/formations', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        console.error('Erreur HTTP lors du chargement des formations')
        return
      }
      
      const data = await res.json()
      setFormations(data.formations || [])
    } catch (err) {
      console.error('Erreur lors du chargement des formations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    const payload = {
      ...formData,
      modules: formData.modules.filter(m => m.trim() !== '')
    }

    try {
      let res
      if (editMode && editingId) {
        // Update existing formation
        res = await fetch(`/api/formations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        // Create new formation
        res = await fetch('/api/formations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        await fetchFormations()
        setShowForm(false)
        setEditMode(false)
        setEditingId(null)
        setFormData({ titre: '', description: '', categorie: '', duree: '', prix: '', certifiante: false, modules: [''] })
      } else {
        alert(editMode ? "Erreur lors de la modification de la formation" : "Erreur lors de la création de la formation")
      }
    } catch {
      alert("Une erreur est survenue")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (formation: Formation) => {
    setFormData({
      titre: formation.titre,
      description: formation.description,
      categorie: formation.categorie,
      duree: formation.duree,
      prix: formation.prix,
      certifiante: formation.certifiante,
      modules: formation.modules.length > 0 ? formation.modules : ['']
    })
    setEditingId(formation.id)
    setEditMode(true)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({ titre: '', description: '', categorie: '', duree: '', prix: '', certifiante: false, modules: [''] })
    setEditMode(false)
    setEditingId(null)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        const res = await fetch(`/api/formations/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          await fetchFormations()
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch {
        alert('Une erreur est survenue')
      }
    }
  }

  const addModule = () => {
    setFormData({ ...formData, modules: [...formData.modules, ''] })
  }

  const removeModule = (index: number) => {
    const newModules = formData.modules.filter((_, i) => i !== index)
    setFormData({ ...formData, modules: newModules })
  }

  const updateModule = (index: number, value: string) => {
    const newModules = formData.modules.map((m, i) => i === index ? value : m)
    setFormData({ ...formData, modules: newModules })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gestion des formations</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg shadow-orange-600/10"
        >
          <Plus className="w-5 h-5" />
          Ajouter une formation
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </div>
      ) : formations.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <BookOpen className="w-16 h-16 text-orange-200/20 mx-auto mb-4" />
          <p className="text-orange-200/60 font-medium">Aucune formation enregistrée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {formations.map((formation) => (
            <div 
              key={formation.id} 
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-orange-500/20 text-orange-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {formation.categorie}
                  </span>
                  {formation.certifiante && (
                    <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Certifiante
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{formation.titre}</h3>
                <p className="text-orange-100/70 text-sm mb-4 max-w-3xl">{formation.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-orange-200/50">
                  <span>Duree: <strong className="text-white font-medium">{formation.duree}</strong></span>
                  <span>|</span>
                  <span>Prix: <strong className="text-white font-medium">{formation.prix}</strong></span>
                  <span>|</span>
                  <span>Modules: <strong className="text-white font-medium">{formation.modules.length}</strong></span>
                </div>
              </div>
              <div className="flex gap-2 self-end md:self-center">
                <button
                  onClick={() => handleEdit(formation)}
                  className="p-3 text-blue-400 hover:text-white hover:bg-blue-600/20 rounded-2xl transition-all duration-200 border border-blue-500/10 flex items-center gap-2 text-sm font-semibold"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5" />
                  <span className="hidden sm:inline">Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(formation.id)}
                  className="p-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-2xl transition-all duration-200 border border-red-500/10"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'ajout */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editMode ? 'Modifier la formation' : 'Ajouter une formation'}
              </h2>
              <button 
                onClick={resetForm} 
                className="text-orange-200/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Titre *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  placeholder="ex: Lead Implementer ISO 27001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Catégorie *</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all [&>option]:bg-slate-900"
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée de la formation..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-orange-100 mb-2">Prix</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    placeholder="ex: 1 500 000 FCFA"
                  />
                </div>
              </div>

              <div className="py-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/10 text-orange-600 focus:ring-orange-500 bg-black/35"
                    checked={formData.certifiante}
                    onChange={(e) => setFormData({ ...formData, certifiante: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-orange-100 select-none">Formation certifiante</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">Modules</label>
                {formData.modules.map((module, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 bg-black/35 border border-white/10 rounded-2xl text-white placeholder-orange-200/20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      value={module}
                      onChange={(e) => updateModule(index, e.target.value)}
                      placeholder={`Module ${index + 1}`}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeModule(index)}
                        className="p-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-2xl border border-red-500/10 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addModule}
                  className="text-orange-500 hover:text-orange-400 text-sm font-semibold transition-colors mt-1"
                >
                  + Ajouter un module
                </button>
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
                  'Créer la formation'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
