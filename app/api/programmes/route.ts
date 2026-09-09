import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('programmes')
      .select('*')
      .order('ordre')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ programmes: data || [] })
  } catch (error) {
    console.error('Erreur GET /api/programmes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    const body = await request.json()
    const payload = {
      ...body,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('programmes')
      .insert(payload)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/programmes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
