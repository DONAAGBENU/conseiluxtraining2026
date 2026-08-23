export const ADMIN_EMAIL = 'contact@conseiluxtraining.com'
export const ADMIN_WHATSAPP_DISPLAY = '+228 90 54 64 64'
export const ADMIN_WHATSAPP = '22890546464'

export function buildAdminMailto(subject: string, body: string) {
  return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildAdminWhatsAppUrl(message: string) {
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`
}

export function inscriptionMessage(lead: {
  nom: string
  email: string
  telephone: string
  entreprise?: string
  pays?: string
  ville?: string
  formationTitre?: string
  message?: string
  contactPreference?: string
}) {
  return [
    `Nouvelle inscription à une formation`,
    ``,
    `Formation : ${lead.formationTitre || 'Non précisée'}`,
    `Nom : ${lead.nom}`,
    `Email : ${lead.email}`,
    `Téléphone : ${lead.telephone}`,
    lead.entreprise ? `Entreprise : ${lead.entreprise}` : null,
    lead.pays ? `Pays : ${lead.pays}` : null,
    lead.ville ? `Ville : ${lead.ville}` : null,
    lead.message ? `Message : ${lead.message}` : null,
    `Canal : ${lead.contactPreference === 'whatsapp' ? 'WhatsApp' : 'Email'}`,
    `Date : ${new Date().toLocaleString('fr-FR')}`,
  ]
    .filter(Boolean)
    .join('\n')
}
