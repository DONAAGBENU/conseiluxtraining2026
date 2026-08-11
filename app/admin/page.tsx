'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Calendar, Star, Users, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    formations: 0,
    dates: 0,
    avis: 0,
    avisEnAttente: 0,
    inscriptions: 0,
  })
  const [recentLeads, setRecentLeads] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [resFormations, resDates, resAvis, resLeads] = await Promise.all([
        fetch('/api/formations'),
        fetch('/api/dates'),
        fetch('/api/avis'),
        fetch('/api/leads'),
      ])

      const dataFormations = await resFormations.json()
      const dataDates = await resDates.json()
      const dataAvis = await resAvis.json()
      const dataLeads = await resLeads.json()

      const listFormations = dataFormations.formations || []
      const listDates = dataDates.dates || []
      const listAvis = dataAvis.avis || []
      const listLeads = dataLeads.leads || []

      setStats({
        formations: listFormations.length,
        dates: listDates.length,
        avis: listAvis.length,
        avisEnAttente: listAvis.filter((a: any) => !a.approuve).length,
        inscriptions: listLeads.length,
      })

      setRecentLeads(listLeads.slice(0, 5))
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Formations',
      value: stats.formations,
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-blue-600/20 text-blue-400 border-blue-500/20',
      href: '/admin/formations',
    },
    {
      label: 'Dates programmées',
      value: stats.dates,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-green-600/20 text-green-400 border-green-500/20',
      href: '/admin/dates',
    },
    {
      label: 'Avis clients',
      value: stats.avis,
      icon: <Star className="w-8 h-8" />,
      color: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/20',
      href: '/admin/avis',
    },
    {
      label: 'Inscriptions / Leads',
      value: stats.inscriptions,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-orange-600/20 text-orange-400 border-orange-500/20',
      href: '/admin/inscriptions',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Tableau de bord</h1>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className={`bg-white/5 backdrop-blur-sm border ${stat.color.split(' ')[2]} rounded-3xl p-6 shadow-md hover:shadow-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 block`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200/60 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]} p-4 rounded-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières Inscriptions */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-lg">Dernières inscriptions</h3>
            <Link href="/admin/inscriptions" className="text-orange-500 text-sm hover:underline font-medium">
              Voir tout
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-orange-200/40 text-sm py-4">Aucune inscription enregistrée pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-semibold text-white">{lead.nom}</p>
                    <p className="text-xs text-orange-200/60 mt-0.5">
                      {lead.formationTitre ? `Formation : ${lead.formationTitre}` : 'Téléchargement Catalogue'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-orange-200/40">
                      {new Date(lead.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span
                      className={`block text-[10px] px-2 py-0.5 rounded-full mt-1 font-semibold text-center ${
                        lead.source === 'inscription'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {lead.source === 'inscription' ? 'Inscription' : 'Catalogue'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avis en attente d'approbation */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-lg">Avis en attente ({stats.avisEnAttente})</h3>
            <Link href="/admin/avis" className="text-orange-500 text-sm hover:underline font-medium">
              Gérer les avis
            </Link>
          </div>
          {stats.avisEnAttente === 0 ? (
            <p className="text-orange-200/40 text-sm py-4">Aucun avis en attente d'approbation.</p>
          ) : (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
              <span className="text-2xl">⭐</span>
              <p className="text-orange-200 text-sm mt-2">
                Vous avez {stats.avisEnAttente} avis client{stats.avisEnAttente > 1 ? 's' : ''} en attente de modération.
              </p>
              <Link
                href="/admin/avis"
                className="inline-block mt-3 bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-orange-500 transition-colors"
              >
                Modérer maintenant
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
