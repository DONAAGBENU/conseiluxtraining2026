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

export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ formations: [], total: 0 })
    }

    const { data: formations, error } = await supabase
      .from('formations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    return NextResponse.json({ formations: formations || [], total: formations?.length || 0 })
  } catch (error) {
    console.error('Erreur GET /api/formations:', error)
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
    const { titre, description, categorie, duree, prix, certifiante, modules } = body

    if (!titre || !categorie || !description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data: formation, error } = await supabase
      .from('formations')
      .insert({
        titre,
        description,
        categorie,
        duree: duree || 'À définir',
        prix: prix || 'À définir',
        certifiante: !!certifiante,
        modules: Array.isArray(modules) ? modules : []
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
    }

    return NextResponse.json({ success: true, formation }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/formations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
