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

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const body = await request.json()
    const { nom, email, telephone, sujet, message } = body

    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      )
    }

    const { data: messageData, error } = await supabase
      .from('messages')
      .insert({
        nom,
        email,
        telephone: telephone || '',
        sujet: sujet || 'Autre',
        message,
        lu: false
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Message enregistré', data: messageData },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur POST /api/messages:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ messages: [], total: 0 })
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [], total: messages?.length || 0 })
  } catch (error) {
    console.error('Erreur GET /api/messages:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}