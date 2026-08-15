import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json')

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
  const dir = path.dirname(MESSAGES_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8')
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messages = readMessages()
    const index = messages.findIndex((m: any) => m.id === params.id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 })
    }

    messages[index].lu = true
    writeMessages(messages)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messages = readMessages()
    const filtered = messages.filter((m: any) => m.id !== params.id)
    writeMessages(filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}