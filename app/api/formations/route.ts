import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/supabaseDb'
import { FORMATIONS_CATALOG, getFormationImage } from '@/app/data/formationsData'

export async function GET() {
  try {
    let dbFormations: any[] = []
    try {
      dbFormations = await listActive('formations')
    } catch (e) {
      console.warn('Could not read from db, using fallback catalog:', e)
    }

    // Filter out test/junk items if any, e.g. "knylwk4jny3"
    const cleanedDb = dbFormations.filter(f => {
      const t = (f.titre || '').trim().toLowerCase()
      return t.length > 2 && !t.includes('knylwk')
    })

    // Merge: start with DB formations, then add catalog items that aren't already represented
    const dbTitles = new Set(cleanedDb.map(f => (f.titre || '').toLowerCase().trim()))
    const dbIds = new Set(cleanedDb.map(f => String(f.id)))

    const missingCatalog = FORMATIONS_CATALOG.filter(c => {
      const t = c.titre.toLowerCase().trim()
      return !dbTitles.has(t) && !dbIds.has(c.id)
    })

    const combined = [...cleanedDb, ...missingCatalog].map(f => ({
      ...f,
      image: getFormationImage(f),
      modules: Array.isArray(f.modules) ? f.modules : [],
      certifiante: Boolean(f.certifiante),
    }))

    return NextResponse.json({ formations: combined, total: combined.length })
  } catch (error) {
    console.error('Erreur GET /api/formations:', error)
    // Fallback to static catalog in case of any database glitch
    return NextResponse.json({ formations: FORMATIONS_CATALOG, total: FORMATIONS_CATALOG.length })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titre, description, categorie, duree, prix, certifiante, modules, objectif, prerequis, image } = body

    if (!titre || !categorie || !description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const payload: any = {
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

    // Utiliser l'image fournie ou générer une image par défaut
    if (image) {
      payload.image = image
    } else {
      // Générer une image par défaut basée sur la catégorie/titre
      payload.image = getFormationImage({ titre, categorie })
    }

    const formation = await createItem('formations', payload)

    return NextResponse.json({ success: true, formation }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/formations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
