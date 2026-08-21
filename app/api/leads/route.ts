import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (e) {
    console.error('Invalid Supabase URL format:', supabaseUrl)
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const body = await request.json()

    const { nom, email, telephone, entreprise, source, date, pays, ville, formationTitre, message, contactPreference } = body

    // Validation basique
    if (!nom || !email || !telephone) {
      return NextResponse.json(
        { error: 'Nom, email et téléphone sont requis' },
        { status: 400 }
      )
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        nom,
        email,
        telephone,
        entreprise: entreprise || '',
        source: source || 'catalogue',
        date: date || new Date().toISOString(),
        pays: pays || '',
        ville: ville || '',
        formation_titre: formationTitre || '',
        message: message || '',
        contact_preference: contactPreference || 'email'
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Lead enregistré', lead },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur POST /api/leads:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ leads: [], total: 0 })
    }

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    return NextResponse.json({ leads: leads || [], total: leads?.length || 0 })
  } catch (error) {
    console.error('Erreur GET /api/leads:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}