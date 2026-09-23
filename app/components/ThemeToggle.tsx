"use client"

import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  compact?: boolean
  className?: string
}

export default function ThemeToggle({ compact = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render placeholder with same size to prevent layout shift
    return (
      <div className={`w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 ${className}`} />
    )
  }

  const isDark = theme === 'dark'

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? 'Passer au thème clair (Blanc)' : 'Passer au thème sombre (Noir)'}
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        className={`p-2 rounded-xl transition-all duration-200 border ${
          isDark
            ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
        } ${className}`}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Passer au thème clair (Blanc)' : 'Passer au thème sombre (Noir)'}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-xs ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-amber-400/50 hover:text-amber-300'
          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 shadow-slate-100'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>Mode Clair</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-slate-600" />
          <span>Mode Sombre</span>
        </>
      )}
    </button>
  )
}
