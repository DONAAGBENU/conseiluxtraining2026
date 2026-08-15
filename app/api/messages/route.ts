import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
// import { sendContactNotification } from '@/lib/emailService'
// import { generateContactWhatsAppMessage } from '@/lib/whatsappService'

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json')

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readMessages() {
  try {
    if (!fs.existsSync(MESSAGES_FILE)) return []
    const content = fs.readFileSync(MESSAGES_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeMessages(messages: any[]) {
  ensureDataDir()
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, email, telephone, sujet, message } = body

    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      )
    }

    const messages = readMessages()
    const newMessage = {
      id: Date.now().toString(),
      nom,
      email,
      telephone: telephone || '',
      sujet: sujet || 'Autre',
      message,
      date: new Date().toISOString(),
      lu: false
    }

    messages.push(newMessage)
    writeMessages(messages)

    // Notifications email désactivées temporairement pour éviter les erreurs 500
    // À réactiver une fois la configuration SMTP correctement mise en place
    /*
    // Envoyer notification email à l'admin
    try {
      await sendContactNotification(newMessage)
    } catch (notificationError) {
      console.error('Erreur lors de l\'envoi de la notification:', notificationError)
      // On continue même si la notification échoue
    }
    */

    return NextResponse.json(
      { success: true, message: 'Message enregistré', data: newMessage },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const messages = readMessages()
    const sorted = messages.sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return NextResponse.json({ messages: sorted, total: sorted.length })
  } catch (error) {
    console.error('Erreur GET /api/messages:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}