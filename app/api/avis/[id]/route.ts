import { NextRequest, NextResponse } from 'next/server'
import { permanentDelete, softDelete, updateItem } from '@/lib/supabaseDb'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    let body: Record<string, unknown> = {}
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const hasUpdateFields = ['nom', 'role', 'entreprise', 'texte', 'note', 'email', 'telephone', 'logo'].some(
      (key) => key in body
    )

    const avis = hasUpdateFields
      ? await updateItem('avis', id, body)
      : await updateItem('avis', id, { approuve: body.approuve !== undefined ? body.approuve : true })

    if (!avis) {
      return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, avis })
  } catch (error) {
    console.error('Erreur PUT /api/avis/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    if (permanent) {
      const ok = await permanentDelete('avis', id)
      if (!ok) return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 })
      return NextResponse.json({ success: true, message: 'Avis supprimé définitivement' })
    }

    const avis = await softDelete('avis', id)
    if (!avis) {
      return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Avis déplacé dans la corbeille' })
  } catch (error) {
    console.error('Erreur DELETE /api/avis/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
