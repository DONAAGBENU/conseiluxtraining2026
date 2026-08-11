import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATES_FILE = path.join(process.cwd(), 'data', 'dates.json')

function ensureDataDir() {
  const dir = path.dirname(DATES_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const defaultDates = [
  {
    id: '1',
    formationId: '1',
    formationTitre: 'Gestion de Projet PMP',
    lieu: 'Cotonou, Bénin',
    date: '15-19 Septembre 2024',
    duree: '5 jours',
    places: 15,
    disponibles: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    formationId: '2',
    formationTitre: 'Cybersécurité CISSP',
    lieu: 'Lomé, Togo',
    date: '22-26 Septembre 2024',
    duree: '5 jours',
    places: 12,
    disponibles: 5,
    createdAt: new Date().toISOString()
  }
]

function readDates() {
  try {
    ensureDataDir()
    if (!fs.existsSync(DATES_FILE)) {
      fs.writeFileSync(DATES_FILE, JSON.stringify(defaultDates, null, 2), 'utf-8')
      return defaultDates
    }
    const content = fs.readFileSync(DATES_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return defaultDates
  }
}

function writeDates(dates: any[]) {
  ensureDataDir()
  fs.writeFileSync(DATES_FILE, JSON.stringify(dates, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const list = readDates()
    return NextResponse.json({ dates: list, total: list.length })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formationId, formationTitre, lieu, date, duree, places, disponibles } = body

    if (!formationId || !formationTitre || !lieu || !date) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const list = readDates()
    const newDate = {
      id: Date.now().toString(),
      formationId,
      formationTitre,
      lieu,
      date,
      duree: duree || '5 jours',
      places: typeof places === 'number' ? places : 15,
      disponibles: typeof disponibles === 'number' ? disponibles : (typeof places === 'number' ? places : 15),
      createdAt: new Date().toISOString()
    }

    list.push(newDate)
    writeDates(list)

    return NextResponse.json({ success: true, date: newDate }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
