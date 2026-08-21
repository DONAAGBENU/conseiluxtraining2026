'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'visitor',
            page: pathname,
            metadata: {
              timestamp: new Date().toISOString(),
              referrer: document.referrer
            }
          })
        })
      } catch (error) {
        console.error('Erreur tracking visite:', error)
      }
    }

    trackPageView()
  }, [pathname])

  return null
}