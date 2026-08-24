import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/supabaseDb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')

    let leads = (await listActive('leads')).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))

    if (source) {
      leads = leads.filter((lead) => lead.source === source)
    }

    return NextResponse.json({ leads, total: leads.length })
  } catch (error) {
    console.error('Erreur GET /api/leads:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, email, telephone, entreprise, source, date, pays, ville, formationTitre, message, contactPreference } =
      body

    if (!nom || !email || !telephone) {
      return NextResponse.json({ error: 'Nom, email et téléphone sont requis' }, { status: 400 })
    }

    const lead = await createItem('leads', {
      nom,
      email,
      telephone,
      entreprise: entreprise || '',
      source: source || 'catalogue',
      date: date || new Date().toISOString(),
      pays: pays || '',
      ville: ville || '',
      formationTitre: formationTitre || '',
      message: message || '',
      contactPreference: contactPreference || 'email',
    })

    return NextResponse.json({ success: true, message: 'Lead enregistré', lead }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/leads:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
