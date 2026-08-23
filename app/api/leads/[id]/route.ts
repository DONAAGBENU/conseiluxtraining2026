import { NextRequest, NextResponse } from 'next/server'
import { permanentDelete, softDelete, updateItem } from '@/lib/jsonDb'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const body = await request.json()

    const lead = updateItem('leads', id, {
      nom: body.nom,
      email: body.email,
      telephone: body.telephone,
      entreprise: body.entreprise,
      source: body.source,
      pays: body.pays,
      ville: body.ville,
      formationTitre: body.formationTitre,
      message: body.message,
      contactPreference: body.contactPreference,
    })

    if (!lead) {
      return NextResponse.json({ error: 'Enregistrement introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Erreur PUT /api/leads/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    if (permanent) {
      const ok = permanentDelete('leads', id)
      if (!ok) return NextResponse.json({ error: 'Enregistrement introuvable' }, { status: 404 })
      return NextResponse.json({ success: true, message: 'Enregistrement supprimé définitivement' })
    }

    const lead = softDelete('leads', id)
    if (!lead) {
      return NextResponse.json({ error: 'Enregistrement introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Enregistrement déplacé dans la corbeille' })
  } catch (error) {
    console.error('Erreur DELETE /api/leads/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
