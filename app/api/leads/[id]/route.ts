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

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const { id } = await props.params
    const body = await request.json()

    const { data: lead, error } = await supabase
      .from('leads')
      .update({
        nom: body.nom,
        email: body.email,
        telephone: body.telephone,
        entreprise: body.entreprise,
        source: body.source,
        pays: body.pays,
        ville: body.ville,
        formation_titre: body.formationTitre,
        message: body.message,
        contact_preference: body.contactPreference
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Erreur PUT /api/leads/[id]:', error)
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
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Lead supprimé' })
  } catch (error) {
    console.error('Erreur DELETE /api/leads/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}