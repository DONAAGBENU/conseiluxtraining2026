import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ avis: [], total: 0 })
    }

    const { searchParams } = new URL(request.url)
    const filterApproved = searchParams.get('approved') === 'true'

    let query = supabase.from('avis').select('*').order('created_at', { ascending: false })

    if (filterApproved) {
      query = query.eq('approuve', true)
    }

    const { data: avis, error } = await query

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    return NextResponse.json({ avis: avis || [], total: avis?.length || 0 })
  } catch (error) {
    console.error('Erreur GET /api/avis:', error)
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
    const { nom, role, entreprise, texte, note, logo, email, telephone } = body

    // Validate required fields
    if (!nom || !nom.trim()) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }
    if (!texte || !texte.trim()) {
      return NextResponse.json({ error: 'Le commentaire est requis' }, { status: 400 })
    }
    if (!note || note < 1 || note > 5) {
      return NextResponse.json({ error: 'La note doit être entre 1 et 5' }, { status: 400 })
    }

    const { data: avis, error } = await supabase
      .from('avis')
      .insert({
        nom: nom.trim(),
        role: role?.trim() || '',
        entreprise: entreprise?.trim() || '',
        texte: texte.trim(),
        note: Number(note),
        date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
        logo: logo || '',
        email: email?.trim() || '',
        telephone: telephone?.trim() || '',
        approuve: false
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de l\'avis' }, { status: 500 })
    }

    return NextResponse.json({ success: true, avis }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/avis:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
