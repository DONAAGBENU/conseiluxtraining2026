import nodemailer from 'nodemailer'

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'contact@conseiluxtraining.com',
    pass: process.env.SMTP_PASS || ''
  }
})

export async function sendInscriptionNotification(lead: any) {
  const mailOptions = {
    from: 'contact@conseiluxtraining.com',
    to: 'contact@conseiluxtraining.com',
    subject: `Nouvelle inscription - ${lead.formationTitre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f97316;">Nouvelle inscription à une formation</h2>
        <p>Un client s'est inscrit à la formation suivante :</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">${lead.formationTitre}</h3>
        </div>
        
        <h3 style="color: #1f2937;">Informations du client :</h3>
        <ul style="color: #4b5563;">
          <li><strong>Nom :</strong> ${lead.nom}</li>
          <li><strong>Email :</strong> ${lead.email}</li>
          <li><strong>Téléphone :</strong> ${lead.telephone}</li>
          ${lead.entreprise ? `<li><strong>Entreprise :</strong> ${lead.entreprise}</li>` : ''}
          ${lead.pays ? `<li><strong>Pays :</strong> ${lead.pays}</li>` : ''}
          ${lead.ville ? `<li><strong>Ville :</strong> ${lead.ville}</li>` : ''}
          <li><strong>Préférence de contact :</strong> ${lead.contactPreference === 'whatsapp' ? 'WhatsApp' : 'Email'}</li>
        </ul>
        
        ${lead.message ? `
        <h3 style="color: #1f2937;">Message du client :</h3>
        <p style="color: #4b5563; font-style: italic;">"${lead.message}"</p>
        ` : ''}
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          Date de l'inscription : ${new Date(lead.date).toLocaleString('fr-FR')}
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return { success: false, error }
  }
}

export async function sendContactNotification(message: any) {
  const mailOptions = {
    from: 'contact@conseiluxtraining.com',
    to: 'contact@conseiluxtraining.com',
    subject: `Nouveau message de contact - ${message.sujet}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f97316;">Nouveau message de contact</h2>
        
        <h3 style="color: #1f2937;">Informations du client :</h3>
        <ul style="color: #4b5563;">
          <li><strong>Nom :</strong> ${message.nom}</li>
          <li><strong>Email :</strong> ${message.email}</li>
          ${message.telephone ? `<li><strong>Téléphone :</strong> ${message.telephone}</li>` : ''}
          <li><strong>Sujet :</strong> ${message.sujet}</li>
        </ul>
        
        <h3 style="color: #1f2937;">Message :</h3>
        <p style="color: #4b5563; font-style: italic; background: #f3f4f6; padding: 15px; border-radius: 8px;">"${message.message}"</p>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          Date du message : ${new Date(message.date).toLocaleString('fr-FR')}
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return { success: false, error }
  }
}