import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FORMATIONS_FILE = path.join(process.cwd(), 'data', 'formations.json')

function readFormations() {
  try {
    if (!fs.existsSync(FORMATIONS_FILE)) return []
    const content = fs.readFileSync(FORMATIONS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeFormations(formations: any[]) {
  const dir = path.dirname(FORMATIONS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(FORMATIONS_FILE, JSON.stringify(formations, null, 2), 'utf-8')
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const body = await request.json()
    const list = readFormations()
    const index = list.findIndex((f: any) => f.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Formation introuvable' }, { status: 404 })
    }

    list[index] = {
      ...list[index],
      ...body,
      id // Empêcher l'ID de changer
    }

    writeFormations(list)
    return NextResponse.json({ success: true, formation: list[index] })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const list = readFormations()
    const filtered = list.filter((f: any) => f.id !== id)

    if (list.length === filtered.length) {
      return NextResponse.json({ error: 'Formation introuvable' }, { status: 404 })
    }

    writeFormations(filtered)
    return NextResponse.json({ success: true, message: 'Formation supprimée' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
