import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/jsonDb'

function calculateStats(items: { createdAt?: string; created_at?: string }[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const stamp = (item: { createdAt?: string; created_at?: string }) => item.createdAt || item.created_at || ''

  return {
    total: items.length,
    today: items.filter((item) => stamp(item) >= today).length,
    thisWeek: items.filter((item) => stamp(item) >= weekAgo).length,
    thisMonth: items.filter((item) => stamp(item) >= monthAgo).length,
  }
}

export async function GET() {
  try {
    const events = listActive('analytics') as {
      type?: string
      createdAt?: string
      created_at?: string
    }[]

    const visitors = events.filter((item) => item.type === 'visitor')
    const downloads = events.filter((item) => item.type === 'catalogue_download')
    const submissions = events.filter((item) => item.type === 'form_submission')

    return NextResponse.json({
      visitors: calculateStats(visitors),
      catalogueDownloads: calculateStats(downloads),
      formSubmissions: calculateStats(submissions),
    })
  } catch (error) {
    console.error('Erreur GET /api/analytics:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, page, metadata } = body

    if (!type) {
      return NextResponse.json({ error: 'Type requis' }, { status: 400 })
    }

    const data = createItem('analytics', {
      type,
      page: page || '/',
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    })

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/analytics:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
