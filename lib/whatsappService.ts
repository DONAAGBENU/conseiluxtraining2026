export async function sendWhatsAppMessage(phone: string, message: string) {
  // Nettoyer le numéro de téléphone
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  
  // URL de l'API WhatsApp Business (vous aurez besoin d'un compte WhatsApp Business API)
  // Pour l'instant, nous allons utiliser l'URL wa.me qui ouvre WhatsApp sur le device
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  
  return { success: true, url: whatsappUrl }
}

export function generateInscriptionWhatsAppMessage(lead: any): string {
  const message = `
🎓 *NOUVELLE INSCRIPTION* - ConseiluxTraining

📚 *Formation :* ${lead.formationTitre}

👤 *Informations du client :*
• Nom : ${lead.nom}
• Email : ${lead.email}
• Téléphone : ${lead.telephone}
${lead.entreprise ? `• Entreprise : ${lead.entreprise}` : ''}
${lead.pays ? `• Pays : ${lead.pays}` : ''}
${lead.ville ? `• Ville : ${lead.ville}` : ''}
• Préférence de contact : ${lead.contactPreference === 'whatsapp' ? 'WhatsApp' : 'Email'}

${lead.message ? `💬 *Message :* "${lead.message}"` : ''}

📅 *Date :* ${new Date(lead.date).toLocaleString('fr-FR')}
  `.trim()
  
  return message
}

export function generateContactWhatsAppMessage(msg: any): string {
  const message = `
📩 *NOUVEAU MESSAGE DE CONTACT* - ConseiluxTraining

👤 *Informations du client :*
• Nom : ${msg.nom}
• Email : ${msg.email}
${msg.telephone ? `• Téléphone : ${msg.telephone}` : ''}
• Sujet : ${msg.sujet}

💬 *Message :* "${msg.message}"

📅 *Date :* ${new Date(msg.date).toLocaleString('fr-FR')}
  `.trim()
  
  return message
}