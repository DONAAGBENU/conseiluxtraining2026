import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FORMATIONS_FILE = path.join(process.cwd(), 'data', 'formations.json')

function ensureDataDir() {
  const dir = path.dirname(FORMATIONS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const defaultFormations = [
  {
    id: '1',
    titre: 'Gestion de Projet PMP',
    description: 'Préparez-vous à la certification PMP avec notre programme complet',
    categorie: 'Gestion de projet',
    duree: '5 jours',
    prix: '1 500 000 FCFA',
    certifiante: true,
    modules: ['Introduction au PMP', 'Planification', 'Exécution', 'Suivi et contrôle', 'Clôture'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    titre: 'Cybersécurité CISSP',
    description: 'Formation complète pour la certification CISSP',
    categorie: 'Technologie numérique',
    duree: '5 jours',
    prix: '2 000 000 FCFA',
    certifiante: true,
    modules: ['Sécurité des réseaux', 'Cryptographie', 'Gestion des risques', 'Audit sécurité'],
    createdAt: new Date().toISOString()
  }
]

function readFormations() {
  try {
    ensureDataDir()
    if (!fs.existsSync(FORMATIONS_FILE)) {
      fs.writeFileSync(FORMATIONS_FILE, JSON.stringify(defaultFormations, null, 2), 'utf-8')
      return defaultFormations
    }
    const content = fs.readFileSync(FORMATIONS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return defaultFormations
  }
}

function writeFormations(formations: any[]) {
  ensureDataDir()
  fs.writeFileSync(FORMATIONS_FILE, JSON.stringify(formations, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const list = readFormations()
    return NextResponse.json({ formations: list, total: list.length })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titre, description, categorie, duree, prix, certifiante, modules } = body

    if (!titre || !categorie || !description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const list = readFormations()
    const newFormation = {
      id: Date.now().toString(),
      titre,
      description,
      categorie,
      duree: duree || 'À définir',
      prix: prix || 'À définir',
      certifiante: !!certifiante,
      modules: Array.isArray(modules) ? modules : [],
      createdAt: new Date().toISOString()
    }

    list.push(newFormation)
    writeFormations(list)

    return NextResponse.json({ success: true, formation: newFormation }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
