import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const AVIS_FILE = path.join(process.cwd(), 'data', 'avis.json')

function readAvis() {
  try {
    if (!fs.existsSync(AVIS_FILE)) return []
    const content = fs.readFileSync(AVIS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeAvis(avis: any[]) {
  const dir = path.dirname(AVIS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(AVIS_FILE, JSON.stringify(avis, null, 2), 'utf-8')
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const list = readAvis()
    const index = list.findIndex((a: any) => a.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 })
    }

    list[index].approuve = true

    writeAvis(list)
    return NextResponse.json({ success: true, avis: list[index] })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const list = readAvis()
    const filtered = list.filter((a: any) => a.id !== id)

    if (list.length === filtered.length) {
      return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 })
    }

    writeAvis(filtered)
    return NextResponse.json({ success: true, message: 'Avis supprimé' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
