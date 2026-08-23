import { NextRequest, NextResponse } from 'next/server'
import { permanentDelete, softDelete, updateItem } from '@/lib/jsonDb'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const body = await request.json()
    const { formationId, formationTitre, lieu, date, duree, places, disponibles } = body

    if (!formationId || !formationTitre || !lieu || !date) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const dateRecord = updateItem('dates', id, {
      formationId,
      formationTitre,
      lieu,
      date,
      duree: duree || '5 jours',
      places: typeof places === 'number' ? places : 15,
      disponibles: typeof disponibles === 'number' ? disponibles : typeof places === 'number' ? places : 15,
    })

    if (!dateRecord) {
      return NextResponse.json({ error: 'Date introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, date: dateRecord })
  } catch (error) {
    console.error('Erreur PUT /api/dates/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    if (permanent) {
      const ok = permanentDelete('dates', id)
      if (!ok) return NextResponse.json({ error: 'Date introuvable' }, { status: 404 })
      return NextResponse.json({ success: true, message: 'Date supprimée définitivement' })
    }

    const dateRecord = softDelete('dates', id)
    if (!dateRecord) {
      return NextResponse.json({ error: 'Date introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Date déplacée dans la corbeille' })
  } catch (error) {
    console.error('Erreur DELETE /api/dates/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
