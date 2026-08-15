import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
// import { sendInscriptionNotification } from '@/lib/emailService'
// import { generateInscriptionWhatsAppMessage, sendWhatsAppMessage } from '@/lib/whatsappService'

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

// POST — Ajouter un nouveau lead/inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { nom, email, telephone, entreprise, source, date, pays, ville, formationTitre, message, contactPreference } = body

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
      pays: pays || '',
      ville: ville || '',
      formationTitre: formationTitre || '',
      message: message || '',
      contactPreference: contactPreference || 'email',
    }

    leads.push(newLead)
    writeLeads(leads)

    // Notifications désactivées temporairement pour éviter les erreurs 500
    // À réactiver une fois la configuration SMTP correctement mise en place
    /*
    // Envoyer notification selon la préférence du client (non bloquant)
    // Exécuté en arrière-plan pour ne pas bloquer la réponse
    setImmediate(async () => {
      try {
        if (newLead.contactPreference === 'whatsapp') {
          // Pour WhatsApp, on génère le message et on pourrait l'envoyer via API
          // Pour l'instant, on stocke l'information pour que l'admin puisse contacter via WhatsApp
          const whatsappMessage = generateInscriptionWhatsAppMessage(newLead)
          console.log('Message WhatsApp généré:', whatsappMessage)
        } else {
          // Envoyer email par défaut
          await sendInscriptionNotification(newLead)
        }
      } catch (notificationError) {
        console.error('Erreur lors de l\'envoi de la notification:', notificationError)
        // On continue même si la notification échoue
      }
    })
    */

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
    console.error('Erreur GET /api/leads:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}