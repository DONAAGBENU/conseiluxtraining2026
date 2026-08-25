import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/supabaseDb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filterApproved = searchParams.get('approved') === 'true'

    let avis = (await listActive('avis')).sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    )

    if (filterApproved) {
      avis = avis.filter((item) => item.approuve)
    }

    return NextResponse.json({ avis, total: avis.length })
  } catch (error) {
    console.error('Erreur GET /api/avis:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, role, entreprise, texte, note, logo, email, telephone } = body

    if (!nom || !String(nom).trim()) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }
    if (!texte || !String(texte).trim()) {
      return NextResponse.json({ error: 'Le commentaire est requis' }, { status: 400 })
    }
    if (!note || note < 1 || note > 5) {
      return NextResponse.json({ error: 'La note doit être entre 1 et 5' }, { status: 400 })
    }

    const avis = await createItem('avis', {
      nom: String(nom).trim(),
      role: role?.trim() || '',
      entreprise: entreprise?.trim() || '',
      texte: String(texte).trim(),
      note: Number(note),
      date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      logo: logo || '',
      email: email?.trim() || '',
      telephone: telephone?.trim() || '',
      approuve: false,
    })

    return NextResponse.json({ success: true, avis }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/avis:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
