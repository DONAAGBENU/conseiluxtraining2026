'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const VISITOR_KEY = 'ctx_unique_visitor'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    const track = async () => {
      try {
        const alreadyCounted = typeof window !== 'undefined' && localStorage.getItem(VISITOR_KEY)
        if (!alreadyCounted) {
          localStorage.setItem(VISITOR_KEY, new Date().toISOString())
          await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'visitor',
              page: pathname,
              metadata: {
                timestamp: new Date().toISOString(),
                referrer: document.referrer,
              },
            }),
          })
        }
      } catch (error) {
        console.error('Erreur tracking visite:', error)
      }
    }

    track()
  }, [pathname])

  return null
}
