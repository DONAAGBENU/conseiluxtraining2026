'use client'

import { useEffect, useState } from 'react'
import { Loader2, RotateCcw, Trash2 } from 'lucide-react'

interface TrashItem {
  entityType: string
  label: string
  origin: string
  item: {
    id: string
    deletedAt?: string
    titre?: string
    nom?: string
    email?: string
    source?: string
    formationTitre?: string
    sujet?: string
    date?: string
  }
}

const GROUP_ORDER = [
  { key: 'formations', title: 'Formations' },
  { key: 'dates', title: 'Dates de formation' },
  { key: 'inscription', title: 'Inscriptions aux formations' },
  { key: 'catalogue', title: 'Téléchargements catalogue' },
  { key: 'avis', title: 'Avis clients' },
  { key: 'messages', title: 'Messages' },
]

function itemTitle(entry: TrashItem) {
  const { item, origin } = entry
  if (item.titre) return item.titre
  if (item.nom) {
    const extra = item.formationTitre || item.sujet || (origin === 'catalogue' ? 'Catalogue' : '')
    return extra ? `${item.nom} — ${extra}` : item.nom
  }
  return item.id
}

export default function AdminCorbeille() {
  const [items, setItems] = useState<TrashItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrash = async () => {
    try {
      const res = await fetch('/api/trash')
      const data = await res.json()
      setItems(data.items || [])
    } catch (err) {
      console.error('Erreur corbeille:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrash()
  }, [])

  const restore = async (entry: TrashItem) => {
    const res = await fetch('/api/trash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore', entityType: entry.entityType, id: entry.item.id }),
    })
    if (res.ok) {
      await fetchTrash()
    } else {
      alert('Impossible de restaurer cet élément')
    }
  }

  const removeForever = async (entry: TrashItem) => {
    if (!confirm('Supprimer définitivement ? Cette action est irréversible.')) return
    const res = await fetch('/api/trash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'permanent', entityType: entry.entityType, id: entry.item.id }),
    })
    if (res.ok) {
      await fetchTrash()
    } else {
      alert('Impossible de supprimer cet élément')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Corbeille</h1>
      <p className="text-orange-800/80 text-sm mb-8">
        Restaurer renvoie chaque élément exactement dans sa section d&apos;origine. Supprimer l&apos;efface définitivement.
      </p>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <Trash2 className="w-16 h-16 text-orange-800/40 mx-auto mb-4" />
          <p className="text-orange-800/80 font-medium">La corbeille est vide.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {GROUP_ORDER.map((group) => {
            const groupItems = items.filter((entry) => entry.origin === group.key)
            if (groupItems.length === 0) return null
            return (
              <section key={group.key}>
                <h2 className="text-lg font-semibold text-white mb-4">{group.title}</h2>
                <div className="space-y-3">
                  {groupItems.map((entry) => (
                    <div
                      key={`${entry.entityType}-${entry.item.id}`}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-semibold text-white">{itemTitle(entry)}</p>
                        <p className="text-xs text-orange-800/70 mt-1">
                          {entry.item.email ? `${entry.item.email} · ` : ''}
                          Supprimé le{' '}
                          {entry.item.deletedAt
                            ? new Date(entry.item.deletedAt).toLocaleString('fr-FR')
                            : '—'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => restore(entry)}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restaurer
                        </button>
                        <button
                          onClick={() => removeForever(entry)}
                          className="inline-flex items-center gap-2 bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
