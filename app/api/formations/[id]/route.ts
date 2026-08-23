import { NextRequest, NextResponse } from 'next/server'
import { permanentDelete, softDelete, updateItem } from '@/lib/jsonDb'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const body = await request.json()
    const formation = updateItem('formations', id, body)

    if (!formation) {
      return NextResponse.json({ error: 'Formation introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, formation })
  } catch (error) {
    console.error('Erreur PUT /api/formations/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    if (permanent) {
      const ok = permanentDelete('formations', id)
      if (!ok) return NextResponse.json({ error: 'Formation introuvable' }, { status: 404 })
      return NextResponse.json({ success: true, message: 'Formation supprimée définitivement' })
    }

    const formation = softDelete('formations', id)
    if (!formation) {
      return NextResponse.json({ error: 'Formation introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Formation déplacée dans la corbeille' })
  } catch (error) {
    console.error('Erreur DELETE /api/formations/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
