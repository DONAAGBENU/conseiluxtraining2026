import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value

    if (!adminSession) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Erreur GET /api/auth/check:', error)
    return NextResponse.json({ authenticated: false, error: 'Erreur serveur' })
  }
}

export async function POST(request: NextRequest) {
  // Déconnexion en supprimant le cookie
  const response = NextResponse.json({ success: true, message: 'Déconnecté' })
  response.cookies.set('admin_session', '', { expires: new Date(0), path: '/' })
  return response
}
