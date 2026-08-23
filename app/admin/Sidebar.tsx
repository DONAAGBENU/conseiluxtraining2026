'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, Calendar, Star, Users, LogOut, MessageSquare, Download, Trash2, UserPlus } from 'lucide-react'

interface AdminSidebarProps {
  onLogout?: () => void
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Formations', href: '/admin/formations', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Dates de formation', href: '/admin/dates', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Avis clients', href: '/admin/avis', icon: <Star className="w-5 h-5" /> },
    { label: 'Clients', href: '/admin/clients', icon: <UserPlus className="w-5 h-5" /> },
    { label: 'Inscriptions', href: '/admin/inscriptions', icon: <Users className="w-5 h-5" /> },
    { label: 'Messages', href: '/admin/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Corbeille', href: '/admin/corbeille', icon: <Trash2 className="w-5 h-5" /> },
  ]

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        await fetch('/api/auth/check', { method: 'POST' })
        if (onLogout) {
          onLogout()
        }
        router.push('/')
      } catch {
        // En cas d'erreur, forcer la redirection
        router.push('/')
      }
    }
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-white/5 p-6 flex flex-col shrink-0 min-h-screen text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          <span className="text-orange-500">Admin</span>Panel
        </h2>
      </div>

      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-orange-800 text-white font-semibold shadow-lg shadow-orange-600/10'
                  : 'text-white/75 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-200 mt-auto"
      >
        <LogOut className="w-5 h-5" />
        Déconnexion
      </button>
    </aside>
  )
}
