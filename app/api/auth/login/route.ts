import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const adminEmail = process.env.ADMIN_EMAIL || 'contact@conseiluxtraining.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin2345conseil'

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({ success: true, message: 'Connexion réussie' })
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      })

      return response
    }

    return NextResponse.json({ error: 'Identifiants de connexion incorrects' }, { status: 401 })
  } catch (error) {
    console.error('Erreur POST /api/auth/login:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
