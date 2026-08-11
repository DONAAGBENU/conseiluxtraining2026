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

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const list = readDates()
    const filtered = list.filter((d: any) => d.id !== id)

    if (list.length === filtered.length) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    writeDates(filtered)
    return NextResponse.json({ success: true, message: 'Session supprimée' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
