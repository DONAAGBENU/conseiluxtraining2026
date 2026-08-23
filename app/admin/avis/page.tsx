'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Star, Trash2, Loader2, MessageSquare, Mail, Phone } from 'lucide-react'

interface Avis {
  id: string
  nom: string
  role: string
  entreprise: string
  texte: string
  note: number
  date: string
  logo: string
  approuve: boolean
  createdAt: string
  email?: string
  telephone?: string
}

export default function AdminAvis() {
  const [avis, setAvis] = useState<Avis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvis()
  }, [])

  const fetchAvis = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch('/api/avis', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        console.error('Erreur HTTP lors du chargement des avis')
        return
      }
      
      const data = await res.json()
      setAvis(data.avis || [])
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprouver = async (id: string) => {
    try {
      const res = await fetch(`/api/avis/${id}`, {
        method: 'PUT'
      })
      if (res.ok) {
        await fetchAvis()
      } else {
        alert("Erreur lors de l'approbation de l'avis")
      }
    } catch {
      alert("Une erreur est survenue")
    }
  }

  const handleSupprimer = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      try {
        const res = await fetch(`/api/avis/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          await fetchAvis()
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch {
        alert('Une erreur est survenue')
      }
    }
  }

  const getEmailUrl = (email: string, name: string) => {
    const subject = `Votre avis sur ConseiluxTraining`
    const body = `Bonjour ${name},\n\nNous avons bien reçu votre avis sur ConseiluxTraining et nous vous en remercions.\n\nCordialement,\nL'équipe ConseiluxTraining`
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const getWhatsAppUrl = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const msg = `Bonjour ${name}, nous avons bien reçu votre avis sur ConseiluxTraining. Merci pour votre feedback !`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Gestion des avis clients</h1>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </div>
      ) : avis.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <MessageSquare className="w-16 h-16 text-orange-800/40 mx-auto mb-4" />
          <p className="text-orange-800/80 font-medium">Aucun avis client enregistré.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {avis.map((a) => (
            <div 
              key={a.id} 
              className={`bg-white/5 border rounded-3xl p-6 border-l-4 ${
                a.approuve ? 'border-l-green-500 border-white/10' : 'border-l-yellow-500 border-white/10'
              } hover:bg-white/10 transition-all duration-200`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-orange-800/20 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-lg">
                      {a.nom.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{a.nom}</h3>
                      <p className="text-sm text-orange-800/80">
                        {a.role} {a.role && a.entreprise ? 'chez' : ''} {a.entreprise}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex text-orange-400 mb-3">
                    {[...Array(a.note)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-orange-800 text-sm italic font-light">&quot;{a.texte}&quot;</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-orange-800/70 mt-3">
                    <span>Soumis le : {a.date}</span>
                    <span>•</span>
                    <span className={`font-semibold ${a.approuve ? 'text-green-400' : 'text-yellow-400'}`}>
                      {a.approuve ? 'Approuvé et en ligne' : 'En attente de modération'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 self-end md:self-center border-t border-white/5 md:border-0 pt-4 md:pt-0 w-full md:w-auto justify-end flex-wrap">
                  {!a.approuve && (
                    <button
                      onClick={() => handleApprouver(a.id)}
                      className="p-3 text-green-400 hover:text-white hover:bg-green-600/20 rounded-2xl transition-all duration-200 border border-green-500/10 flex items-center gap-2 text-sm font-semibold"
                      title="Approuver"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="md:hidden lg:inline">Approuver</span>
                    </button>
                  )}
                  {a.email && (
                    <a
                      href={getEmailUrl(a.email, a.nom)}
                      className="p-3 text-blue-400 hover:text-white hover:bg-blue-600/20 rounded-2xl transition-all duration-200 border border-blue-500/10"
                      title="Contacter par email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                  {a.telephone && (
                    <a
                      href={getWhatsAppUrl(a.telephone, a.nom)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-green-400 hover:text-white hover:bg-green-600/20 rounded-2xl transition-all duration-200 border border-green-500/10"
                      title="Contacter par WhatsApp"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleSupprimer(a.id)}
                    className="p-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-2xl transition-all duration-200 border border-red-500/10"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
