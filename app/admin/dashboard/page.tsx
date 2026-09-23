'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, BookOpen, Users, Calendar, Star, 
  MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight,
  Loader2, AlertCircle 
} from 'lucide-react'

interface DashboardStats {
  formations: number
  dates: number
  avis: number
  clients: number
  messages: number
  inscriptions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    formations: 0,
    dates: 0,
    avis: 0,
    clients: 0,
    messages: 0,
    inscriptions: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      
      // Fetch all data in parallel
      const [formationsRes, datesRes, avisRes, clientsRes, messagesRes] = await Promise.all([
        fetch('/api/formations', { signal: controller.signal }),
        fetch('/api/dates', { signal: controller.signal }),
        fetch('/api/avis', { signal: controller.signal }),
        fetch('/api/leads', { signal: controller.signal }),
        fetch('/api/messages', { signal: controller.signal })
      ])
      
      clearTimeout(timeoutId)

      const formationsData = await formationsRes.json()
      const datesData = await datesRes.json()
      const avisData = await avisRes.json()
      const clientsData = await clientsRes.json()
      const messagesData = await messagesRes.json()

      const inscriptionsCount = (clientsData.leads || []).filter((lead: any) => lead.source === 'inscription').length

      setStats({
        formations: formationsData.formations?.length || 0,
        dates: datesData.dates?.length || 0,
        avis: avisData.avis?.length || 0,
        clients: clientsData.leads?.length || 0,
        messages: messagesData.messages?.length || 0,
        inscriptions: inscriptionsCount
      })
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err)
      setError('Impossible de charger les statistiques')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Formations',
      value: stats.formations,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-orange-500',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Dates de formation',
      value: stats.dates,
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-blue-500',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Avis clients',
      value: stats.avis,
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Clients totaux',
      value: stats.clients,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Inscriptions',
      value: stats.inscriptions,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500',
      trend: '+20%',
      trendUp: true
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-pink-500',
      trend: '-3%',
      trendUp: false
    }
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400">Chargement du dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-slate-400">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-slate-400">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.color} p-3 rounded-xl`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                card.trendUp ? 'text-green-400' : 'text-red-400'
              }`}>
                {card.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {card.trend}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/formations"
            className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span className="text-white">Ajouter une formation</span>
          </a>
          <a
            href="/admin/dates"
            className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-white">Planifier une date</span>
          </a>
          <a
            href="/admin/messages"
            className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-pink-500" />
            <span className="text-white">Voir les messages</span>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Activité récente</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-slate-300 text-sm">Système opérationnel - Base de données connectée</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-slate-300 text-sm">Dernière synchronisation: {new Date().toLocaleString('fr-FR')}</span>
          </div>
          {stats.formations === 0 && (
            <div className="flex items-center gap-4 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-orange-400 text-sm">Aucune formation dans la base de données. Commencez par ajouter des formations!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
