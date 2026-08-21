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

export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ dates: [], total: 0 })
    }

    const { data: dates, error } = await supabase
      .from('dates_formation')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    return NextResponse.json({ dates: dates || [], total: dates?.length || 0 })
  } catch (error) {
    console.error('Erreur GET /api/dates:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const body = await request.json()
    const { formationId, formationTitre, lieu, date, duree, places, disponibles } = body

    if (!formationId || !formationTitre || !lieu || !date) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data: dateRecord, error } = await supabase
      .from('dates_formation')
      .insert({
        formation_id: formationId,
        formation_titre: formationTitre,
        lieu,
        date,
        duree: duree || '5 jours',
        places: typeof places === 'number' ? places : 15,
        disponibles: typeof disponibles === 'number' ? disponibles : (typeof places === 'number' ? places : 15)
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
    }

    return NextResponse.json({ success: true, date: dateRecord }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/dates:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
