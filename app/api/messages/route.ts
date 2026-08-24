import { NextRequest, NextResponse } from 'next/server'
import { createItem, listActive } from '@/lib/supabaseDb'

export async function GET() {
  try {
    const messages = (await listActive('messages')).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    return NextResponse.json({ messages, total: messages.length })
  } catch (error) {
    console.error('Erreur GET /api/messages:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, email, telephone, sujet, message } = body

    if (!nom || !email || !message) {
      return NextResponse.json({ error: 'Nom, email et message sont requis' }, { status: 400 })
    }

    const messageData = await createItem('messages', {
      nom,
      email,
      telephone: telephone || '',
      sujet: sujet || 'Autre',
      message,
      date: new Date().toISOString(),
      lu: false,
    })

    return NextResponse.json({ success: true, message: 'Message enregistré', data: messageData }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/messages:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
