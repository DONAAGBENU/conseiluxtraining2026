import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATES_FILE = path.join(process.cwd(), 'data', 'dates.json')

function readDates() {
  try {
    if (!fs.existsSync(DATES_FILE)) return []
    const content = fs.readFileSync(DATES_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeDates(dates: any[]) {
  const dir = path.dirname(DATES_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(DATES_FILE, JSON.stringify(dates, null, 2), 'utf-8')
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const body = await request.json()
    const { formationId, formationTitre, lieu, date, duree, places, disponibles } = body

    if (!formationId || !formationTitre || !lieu || !date) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const list = readDates()
    const index = list.findIndex((d: any) => d.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Date introuvable' }, { status: 404 })
    }

    list[index] = {
      ...list[index],
      formationId,
      formationTitre,
      lieu,
      date,
      duree: duree || '5 jours',
      places: typeof places === 'number' ? places : 15,
      disponibles: typeof disponibles === 'number' ? disponibles : (typeof places === 'number' ? places : 15),
    }

    writeDates(list)
    return NextResponse.json({ success: true, date: list[index] })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const list = readDates()
    const filtered = list.filter((d: any) => d.id !== id)

    if (list.length === filtered.length) {
      return NextResponse.json({ error: 'Date introuvable' }, { status: 404 })
    }

    writeDates(filtered)
    return NextResponse.json({ success: true, message: 'Date supprimée' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}