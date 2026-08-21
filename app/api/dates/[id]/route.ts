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

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const { id } = await props.params
    const body = await request.json()
    const { formationId, formationTitre, lieu, date, duree, places, disponibles } = body

    if (!formationId || !formationTitre || !lieu || !date) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data: dateRecord, error } = await supabase
      .from('dates_formation')
      .update({
        formation_id: formationId,
        formation_titre: formationTitre,
        lieu,
        date,
        duree: duree || '5 jours',
        places: typeof places === 'number' ? places : 15,
        disponibles: typeof disponibles === 'number' ? disponibles : (typeof places === 'number' ? places : 15)
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    return NextResponse.json({ success: true, date: dateRecord })
  } catch (error) {
    console.error('Erreur PUT /api/dates/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const { id } = await props.params

    const { error } = await supabase
      .from('dates_formation')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Date supprimée' })
  } catch (error) {
    console.error('Erreur DELETE /api/dates/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}