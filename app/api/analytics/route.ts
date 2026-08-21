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
      return NextResponse.json({ 
        visitors: { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
        catalogueDownloads: { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
        formSubmissions: { total: 0, today: 0, thisWeek: 0, thisMonth: 0 }
      })
    }

    // Get visitor stats
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: visitors, error: visitorsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('type', 'visitor')

    const { data: downloads, error: downloadsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('type', 'catalogue_download')

    const { data: submissions, error: submissionsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('type', 'form_submission')

    if (visitorsError || downloadsError || submissionsError) {
      console.error('Erreur analytics:', visitorsError, downloadsError, submissionsError)
    }

    const calculateStats = (data: any[] | null) => {
      const items = data || []
      return {
        total: items.length,
        today: items.filter((item: any) => item.created_at >= today).length,
        thisWeek: items.filter((item: any) => item.created_at >= weekAgo).length,
        thisMonth: items.filter((item: any) => item.created_at >= monthAgo).length
      }
    }

    return NextResponse.json({
      visitors: calculateStats(visitors),
      catalogueDownloads: calculateStats(downloads),
      formSubmissions: calculateStats(submissions)
    })
  } catch (error) {
    console.error('Erreur GET /api/analytics:', error)
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
    const { type, page, metadata } = body

    if (!type) {
      return NextResponse.json({ error: 'Type requis' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('analytics')
      .insert({
        type,
        page: page || '/',
        metadata: metadata || {},
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/analytics:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}