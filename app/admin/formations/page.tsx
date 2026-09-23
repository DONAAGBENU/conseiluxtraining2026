'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Loader2, Award, BookOpen, Edit, Image as ImageIcon, Sparkles, CheckCircle, Upload } from 'lucide-react'
import { getFormationImage } from '@/app/data/formationsData'

interface Formation {
  id: string
  titre: string
  description: string
  categorie: string
  duree: string
  prix: string
  certifiante: boolean
  modules: string[]
  objectif: string
  prerequis: string
  image?: string
  createdAt?: string
  deletedAt?: string | null
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
    modules: [''],
    objectif: '',
    prerequis: '',
    image: ''
  })
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [uploadingImage, setUploadingImage] = useState(false)

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
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      
      const res = await fetch('/api/formations', {
        cache: 'no-store',
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
      image: formData.image, // Ne pas ajouter d'image par défaut si l'utilisateur n'en fournit pas
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

      const data = await res.json().catch(() => ({}))
      if (res.ok && data.formation) {
        await fetchFormations()
        setShowForm(false)
        setEditMode(false)
        setEditingId(null)
        setFormData({ 
          titre: '', 
          description: '', 
          categorie: '', 
          duree: '', 
          prix: '', 
          certifiante: false, 
          modules: [''], 
          objectif: '', 
          prerequis: '',
          image: '' 
        })
        setImageMode('url')
      } else {
        alert(data.error || (editMode ? "Erreur lors de la modification de la formation" : "Erreur lors de la création de la formation"))
      }
    } catch {
      alert("Une erreur est survenue")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (formation: Formation) => {
    setFormData({
      titre: formation.titre || '',
      description: formation.description || '',
      categorie: formation.categorie || '',
      duree: formation.duree || '',
      prix: formation.prix || '',
      certifiante: !!formation.certifiante,
      modules: formation.modules && formation.modules.length > 0 ? formation.modules : [''],
      objectif: formation.objectif || '',
      prerequis: formation.prerequis || '',
      image: formation.image || ''
    })
    setEditingId(formation.id)
    setEditMode(true)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({ 
      titre: '', 
      description: '', 
      categorie: '', 
      duree: '', 
      prix: '', 
      certifiante: false, 
      modules: [''], 
      objectif: '', 
      prerequis: '',
      image: '' 
    })
    setImageMode('url')
    setEditMode(false)
    setEditingId(null)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        const res = await fetch(`/api/formations/${id}`, {
          method: 'DELETE',
          cache: 'no-store'
        })
        if (res.ok) {
          setFormations((current) => current.filter((item) => item.id !== id))
          await fetchFormations()
        } else {
          const data = await res.json().catch(() => ({}))
          alert(data.error || 'Erreur lors de la suppression')
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      const data = await res.json()
      if (data.success) {
        setFormData({ ...formData, image: data.url })
      } else {
        alert('Erreur lors de l\'upload: ' + data.error)
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Gestion des Formations</h1>
          <p className="text-slate-400 text-sm mt-1">Créez, modifiez et illustrez les formations présentées sur le site</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg shadow-orange-600/20 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une formation</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
          <p className="text-slate-400 text-sm">Chargement des données...</p>
        </div>
      ) : formations.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
          <BookOpen className="w-14 h-14 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Aucune formation enregistrée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {formations.map((formation) => {
            const previewImg = getFormationImage(formation)
            return (
              <div 
                key={formation.id} 
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-5 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  {/* Miniature Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    <img 
                      src={previewImg} 
                      alt={formation.titre} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="bg-orange-500/20 text-orange-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-orange-500/30">
                        {formation.categorie}
                      </span>
                      {formation.certifiante && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                          <Award className="w-3.5 h-3.5" /> Certifiante
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{formation.titre}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 max-w-2xl mb-2">{formation.description}</p>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>Durée : <strong className="text-slate-200">{formation.duree || 'N/A'}</strong></span>
                      <span>•</span>
                      <span>Tarif : <strong className="text-slate-200">{formation.prix || 'Sur devis'}</strong></span>
                      <span>•</span>
                      <span>Modules : <strong className="text-slate-200">{Array.isArray(formation.modules) ? formation.modules.length : 0}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleEdit(formation)}
                    className="px-3 py-2 text-blue-400 hover:text-white hover:bg-blue-600/20 rounded-xl transition-all border border-blue-500/20 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => handleDelete(formation.id)}
                    className="p-2 text-red-400 hover:text-white hover:bg-red-600/20 rounded-xl transition-all border border-red-500/20 cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal d'ajout / modification */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[92vh] overflow-y-auto text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {editMode ? 'Modifier la formation' : 'Ajouter une formation'}
              </h2>
              <button 
                onClick={resetForm} 
                className="text-slate-400 hover:text-white p-1 rounded-full text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Titre de la formation *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  placeholder="ex: Lead Implementer ISO 27001"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Catégorie *</label>
                  <select
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
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
                  <label className="block text-slate-300 font-medium mb-1">Illustration</label>
                  
                  {/* Mode selector */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        imageMode === 'url' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        imageMode === 'upload' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Upload
                    </button>
                  </div>

                  {imageMode === 'url' ? (
                    <input
                      type="url"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/... (optionnel)"
                    />
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-600 file:text-white file:cursor-pointer disabled:opacity-50 text-sm"
                      />
                      {uploadingImage && (
                        <div className="flex items-center gap-2 text-orange-400 text-xs">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Upload en cours...
                        </div>
                      )}
                      {formData.image && (
                        <div className="relative h-32 rounded-lg overflow-hidden border border-slate-700">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description synthétique *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Présentation et proposition de valeur de la formation..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Objectifs pédagogiques</label>
                <textarea
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  value={formData.objectif}
                  onChange={(e) => setFormData({ ...formData, objectif: e.target.value })}
                  placeholder="Ce que les participants sauront faire à l'issue de la formation..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Prérequis</label>
                <textarea
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  value={formData.prerequis}
                  onChange={(e) => setFormData({ ...formData, prerequis: e.target.value })}
                  placeholder="Expérience ou compétences préalables recommandées..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Durée</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    value={formData.duree}
                    onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                    placeholder="ex: 5 jours (35h)"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prix</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    placeholder="ex: 1 500 000 FCFA"
                  />
                </div>
              </div>

              <div className="py-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-700 text-orange-600 focus:ring-orange-500 bg-slate-950"
                    checked={formData.certifiante}
                    onChange={(e) => setFormData({ ...formData, certifiante: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-slate-300">Formation certifiante (délivre un certificat ou diplôme)</span>
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-slate-300 font-medium">Modules du programme</label>
                  <button
                    type="button"
                    onClick={addModule}
                    className="text-orange-400 hover:text-orange-300 text-xs font-semibold cursor-pointer"
                  >
                    + Ajouter un module
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.modules.map((module, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                        value={module}
                        onChange={(e) => updateModule(index, e.target.value)}
                        placeholder={`Module ${index + 1} : Titre et compétences`}
                      />
                      {formData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/20 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 px-6 py-3 text-white text-sm font-semibold shadow-lg shadow-orange-600/20 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <span>{editMode ? 'Enregistrer les modifications' : 'Créer la formation'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
