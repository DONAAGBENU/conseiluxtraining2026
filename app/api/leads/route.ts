import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Fichier JSON où les leads sont stockés
// Plus tard ton admin lira ce fichier
const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json')

// S'assurer que le dossier data/ existe
function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Lire tous les leads existants
function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) return []
    const content = fs.readFileSync(LEADS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

// Sauvegarder les leads
function writeLeads(leads: any[]) {
  ensureDataDir()
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8')
}

// POST — Ajouter un nouveau lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { nom, email, telephone, entreprise, source, date } = body

    // Validation basique
    if (!nom || !email || !telephone) {
      return NextResponse.json(
        { error: 'Nom, email et téléphone sont requis' },
        { status: 400 }
      )
    }

    const leads = readLeads()

    // Nouveau lead avec ID unique
    const newLead = {
      id: Date.now().toString(),
      nom,
      email,
      telephone,
      entreprise: entreprise || '',
      source: source || 'catalogue',
      date: date || new Date().toISOString(),
    }

    leads.push(newLead)
    writeLeads(leads)

    return NextResponse.json(
      { success: true, message: 'Lead enregistré', lead: newLead },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET — Récupérer tous les leads (pour la page admin plus tard)
export async function GET() {
  try {
    const leads = readLeads()

    // Triés du plus récent au plus ancien
    const sorted = leads.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return NextResponse.json({ leads: sorted, total: sorted.length })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}