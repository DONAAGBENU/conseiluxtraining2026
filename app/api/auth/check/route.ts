import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret'
    try {
      const decoded = jwt.verify(token, secret)
      return NextResponse.json({ authenticated: true, user: decoded })
    } catch {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: 'Erreur serveur' })
  }
}

export async function POST(request: NextRequest) {
  // Déconnexion en supprimant le cookie
  const response = NextResponse.json({ success: true, message: 'Déconnecté' })
  response.cookies.set('token', '', { expires: new Date(0), path: '/' })
  return response
}
