import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/supabaseDb'

export async function GET() {
  try {
    const formations = (await listActive('formations')).sort((a, b) => {
      const dateA = a.createdAt || a.created_at || ''
      const dateB = b.createdAt || b.created_at || ''
      return String(dateB).localeCompare(String(dateA))
    })
    console.log('API GET /api/formations - returning:', formations)
    return NextResponse.json({ formations, total: formations.length })
  } catch (error) {
    console.error('Erreur GET /api/formations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titre, description, categorie, duree, prix, certifiante, modules, objectif, prerequis } = body

    if (!titre || !categorie || !description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const formation = await createItem('formations', {
      titre,
      description,
      categorie,
      duree: duree || 'À définir',
      prix: prix || 'À définir',
      certifiante: !!certifiante,
      modules: Array.isArray(modules) ? modules : [],
      objectif: objectif || '',
      prerequis: prerequis || '',
    })

    return NextResponse.json({ success: true, formation }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/formations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
