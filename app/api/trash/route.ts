import { NextRequest, NextResponse } from 'next/server'
import { ENTITY_TYPES, EntityType, listTrash, permanentDelete, restoreItem } from '@/lib/jsonDb'

export async function GET() {
  try {
    return NextResponse.json({ items: listTrash() })
  } catch (error) {
    console.error('Erreur GET /api/trash:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, entityType, id } = await request.json()

    if (!ENTITY_TYPES.includes(entityType as EntityType) || !id) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }

    if (action === 'restore') {
      const item = restoreItem(entityType as EntityType, id)
      if (!item) {
        return NextResponse.json({ error: 'Élément introuvable dans la corbeille' }, { status: 404 })
      }
      return NextResponse.json({ success: true, item })
    }

    if (action === 'permanent') {
      const ok = permanentDelete(entityType as EntityType, id)
      if (!ok) {
        return NextResponse.json({ error: 'Élément introuvable' }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (error) {
    console.error('Erreur POST /api/trash:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
