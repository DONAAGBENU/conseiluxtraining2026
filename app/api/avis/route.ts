import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const AVIS_FILE = path.join(process.cwd(), 'data', 'avis.json')

function ensureDataDir() {
  const dir = path.dirname(AVIS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const defaultAvis = [
  {
    id: '1',
    nom: 'Marie Kouassi',
    role: 'Directrice RH',
    entreprise: 'Groupe SIB',
    texte: 'Grâce à ConseiluxTraining, nous avons certifié 50 collaborateurs en gestion de projet. Un accompagnement exceptionnel.',
    note: 5,
    date: '15 mai 2024',
    logo: '/images/partners/sib.png',
    approuve: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    nom: 'Jean Adé',
    role: 'CEO',
    entreprise: 'Tech Solutions Africa',
    texte: 'La formation en cybersécurité a transformé notre approche. Nos équipes sont désormais certifiées.',
    note: 5,
    date: '12 avril 2024',
    logo: '/images/partners/tech.png',
    approuve: true,
    createdAt: new Date().toISOString()
  }
]

function readAvis() {
  try {
    ensureDataDir()
    if (!fs.existsSync(AVIS_FILE)) {
      fs.writeFileSync(AVIS_FILE, JSON.stringify(defaultAvis, null, 2), 'utf-8')
      return defaultAvis
    }
    const content = fs.readFileSync(AVIS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return defaultAvis
  }
}

function writeAvis(avis: any[]) {
  ensureDataDir()
  fs.writeFileSync(AVIS_FILE, JSON.stringify(avis, null, 2), 'utf-8')
}

export async function GET(request: NextRequest) {
  try {
    const list = readAvis()
    const { searchParams } = new URL(request.url)
    const filterApproved = searchParams.get('approved') === 'true'

    const filtered = filterApproved ? list.filter((a: any) => a.approuve) : list
    return NextResponse.json({ avis: filtered, total: filtered.length })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, role, entreprise, texte, note, logo, email, telephone } = body

    if (!nom || !texte || !note) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const list = readAvis()
    const newAvis = {
      id: Date.now().toString(),
      nom,
      role: role || '',
      entreprise: entreprise || '',
      texte,
      note: Number(note) || 5,
      date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      logo: logo || '',
      email: email || '',
      telephone: telephone || '',
      approuve: false, // Doit être approuvé par l'admin
      createdAt: new Date().toISOString()
    }

    list.push(newAvis)
    writeAvis(list)

    return NextResponse.json({ success: true, avis: newAvis }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
