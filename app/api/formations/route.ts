import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/supabaseDb'
import { getFormationImage } from '@/app/data/formationsData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dbFormations = await listActive('formations')

    const formations = dbFormations.map((f) => ({
      ...f,
      image: getFormationImage(f as { image?: string; categorie?: string; titre?: string }),
      modules: Array.isArray((f as { modules?: unknown }).modules) ? ((f as unknown as { modules: string[] }).modules) : [],
      certifiante: Boolean((f as { certifiante?: boolean }).certifiante),
    }))

    return NextResponse.json(
      { formations, total: formations.length },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('Erreur GET /api/formations:', error)
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    return NextResponse.json({ error: message, formations: [], total: 0 }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titre, description, categorie, duree, prix, certifiante, modules, objectif, prerequis, image } = body

    if (!titre || !categorie || !description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const payload: Record<string, unknown> = {
      titre,
      description,
      categorie,
      duree: duree || 'À définir',
      prix: prix || 'À définir',
      certifiante: !!certifiante,
      modules: Array.isArray(modules) ? modules : [],
      objectif: objectif || '',
      prerequis: prerequis || '',
    }

    if (image && String(image).trim()) {
      payload.image = String(image).trim()
    }

    const formation = await createItem('formations', payload)

    return NextResponse.json({ success: true, formation }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/formations:', error)
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
