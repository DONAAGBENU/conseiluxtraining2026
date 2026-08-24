import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/supabaseDb'

export async function GET() {
  try {
    const dates = (await listActive('dates')).sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    )
    return NextResponse.json({ dates, total: dates.length })
  } catch (error) {
    console.error('Erreur GET /api/dates:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formationId, formationTitre, lieu, date, duree, places, disponibles } = body

    if (!formationId || !formationTitre || !lieu || !date) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const dateRecord = await createItem('dates', {
      formationId,
      formationTitre,
      lieu,
      date,
      duree: duree || '5 jours',
      places: typeof places === 'number' ? places : 15,
      disponibles: typeof disponibles === 'number' ? disponibles : typeof places === 'number' ? places : 15,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, date: dateRecord }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/dates:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
