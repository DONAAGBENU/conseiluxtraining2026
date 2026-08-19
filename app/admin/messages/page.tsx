'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MessageSquare, Loader2, Search, Calendar, Check, X } from 'lucide-react'

interface Message {
  id: string
  nom: string
  email: string
  telephone: string
  sujet: string
  message: string
  date: string
  lu: boolean
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch('/api/messages', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error(`Erreur HTTP ${res.status} lors du chargement des messages:`, errorText)
        setMessages([]) // Set empty array on error to avoid UI breaking
        return
      }
      
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err)
      setMessages([]) // Set empty array on error to avoid UI breaking
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT'
      })
      if (res.ok) {
        await fetchMessages()
      }
    } catch (err) {
      console.error('Erreur lors du marquage comme lu:', err)
    }
  }

  const deleteMessage = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        const res = await fetch(`/api/messages/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          await fetchMessages()
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch (err) {
        alert('Une erreur est survenue')
      }
    }
  }

  const filteredMessages = messages.filter(msg => {
    const query = searchQuery.toLowerCase()
    return (
      msg.nom.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.sujet.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query)
    )
  })

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages de contact</h1>
          <p className="text-orange-800/60 text-sm mt-1">Gérez les messages envoyés via le formulaire de contact</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-800/40" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, sujet..."
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
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <MessageSquare className="w-16 h-16 text-orange-800/20 mx-auto mb-4" />
          <p className="text-orange-800/60 font-medium">Aucun message ne correspond aux critères.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white/5 border rounded-3xl p-6 border-l-4 ${
                msg.lu ? 'border-l-green-500 border-white/10' : 'border-l-orange-500 border-white/10'
              } hover:bg-white/10 transition-all duration-200`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-orange-500/20 text-orange-400">
                      {msg.sujet}
                    </span>
                    <span className="text-xs text-orange-800/40 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(msg.date).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {!msg.lu && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-red-500/20 text-red-400">
                        Nouveau
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{msg.nom}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-2 text-sm text-orange-800/70">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="break-all">{msg.email}</span>
                    </p>
                    {msg.telephone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                        {msg.telephone}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 bg-black/25 rounded-2xl p-4">
                    <p className="text-orange-800/90 text-sm italic">&quot;{msg.message}&quot;</p>
                  </div>
                </div>

                <div className="flex gap-2 self-end md:self-center border-t border-white/5 md:border-0 pt-4 md:pt-0 w-full md:w-auto justify-end">
                  {!msg.lu && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="p-3 text-green-400 hover:text-white hover:bg-green-600/20 rounded-2xl transition-all duration-200 border border-green-500/10 flex items-center gap-2 text-sm font-semibold"
                      title="Marquer comme lu"
                    >
                      <Check className="w-5 h-5" />
                      <span className="md:hidden lg:inline">Lu</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-2xl transition-all duration-200 border border-red-500/10"
                    title="Supprimer"
                  >
                    <X className="w-5 h-5" />
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