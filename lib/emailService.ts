import nodemailer from 'nodemailer'

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
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

export async function sendTestLevelNotification(studentData: any, result: any, date: string) {
  const mailOptions = {
    from: 'contact@conseiluxtraining.com',
    to: 'Formations@conseiluxtraining.com',
    subject: `Nouveau Test de Niveau Soumis - ${studentData.name} (${result.level})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="background-color: #ff6b00; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px;">Conseilux Language Academy</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Rapport d'évaluation du Test de Niveau (5 Sections)</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #0a1128; border-bottom: 2px solid #ff6b00; padding-bottom: 8px;">1. Informations sur l'Étudiant</h2>
          <table style="width: 100%; font-size: 14px; color: #374151; margin-bottom: 20px;">
            <tr><td style="padding: 4px 0; font-weight: bold; width: 40%;">Nom & Prénom :</td><td>${studentData.name}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Niveau d'études :</td><td><span style="background: #ff6b00; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${studentData.educationLevel || 'Non précisé'}</span></td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Email :</td><td><a href="mailto:${studentData.email}" style="color: #ff6b00;">${studentData.email}</a></td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Téléphone :</td><td><a href="tel:${studentData.phone}" style="color: #ff6b00;">${studentData.phone}</a></td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Localisation :</td><td>${studentData.city || ''}, ${studentData.country || ''}</td></tr>
            ${studentData.company ? `<tr><td style="padding: 4px 0; font-weight: bold;">Entreprise :</td><td>${studentData.company}</td></tr>` : ''}
          </table>
          
          <h2 style="color: #0a1128; border-bottom: 2px solid #ff6b00; padding-bottom: 8px;">2. Résultats par Section (5/5)</h2>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 2px solid #cbd5e1; text-align: left; color: #475569;">
                  <th style="padding: 8px;">Section</th>
                  <th style="padding: 8px; text-align: center;">Score</th>
                  <th style="padding: 8px; text-align: center;">Pourcentage / Note</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px; font-weight: bold;">SECTION I: Grammar (Use of English)</td>
                  <td style="padding: 8px; text-align: center; font-weight: bold; color: #ff6b00;">${result.grammarScore} / 20</td>
                  <td style="padding: 8px; text-align: center;">${Math.round((result.grammarScore / 20) * 100)}%</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px; font-weight: bold;">SECTION II: Reading Comprehension</td>
                  <td style="padding: 8px; text-align: center; font-weight: bold; color: #ff6b00;">${result.readingScore} / 25</td>
                  <td style="padding: 8px; text-align: center;">${Math.round((result.readingScore / 25) * 100)}%</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px; font-weight: bold;">SECTION III: Listening Comprehension</td>
                  <td style="padding: 8px; text-align: center; font-weight: bold; color: #ff6b00;">${result.listeningScore} / 25</td>
                  <td style="padding: 8px; text-align: center;">${Math.round((result.listeningScore / 25) * 100)}%</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px; font-weight: bold;">SECTION IV: Writing (TOEFL 2024 Format 3 tasks)</td>
                  <td style="padding: 8px; text-align: center; font-weight: bold; color: #ff6b00;">${result.writingScore} / 15</td>
                  <td style="padding: 8px; text-align: center;">Soumis pour révision</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px; font-weight: bold;">SECTION V: Speaking (TOEFL Format 4 tasks ~20 mins)</td>
                  <td style="padding: 8px; text-align: center; font-weight: bold; color: #ff6b00;">${result.speakingScore} / 20</td>
                  <td style="padding: 8px; text-align: center;">Enregistrements vocaux soumis</td>
                </tr>
                <tr style="background: #fff3ed; font-[#0a1128]">
                  <td style="padding: 10px; font-weight: bold; font-size: 15px;">SCORE TOTAL CORE (Grammar+Reading+Listening)</td>
                  <td style="padding: 10px; text-align: center; font-weight: bold; font-size: 16px; color: #ff6b00;">${result.totalCoreScore} / 70</td>
                  <td style="padding: 10px; text-align: center; font-weight: bold; font-size: 16px; color: #ff6b00;">${result.percentage}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style="background: ${result.passed ? '#ecfdf5' : '#fffbebe'}; border: 2px solid ${result.passed ? '#10b981' : '#f59e0b'}; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #374151;">NIVEAU ÉVALUÉ POUR L'ÉTUDIANT</p>
            <h3 style="margin: 5px 0; font-size: 28px; color: ${result.passed ? '#059669' : '#d97706'}; font-weight: bold;">${result.level} (${result.passed ? 'Admis Tracktest B1' : 'Sous le seuil B1'})</h3>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Seuil de réussite B1 : 65% (46/70)</p>
          </div>

          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 12px; color: #475569;">
            <p style="margin: 0;"><strong>Remarque administration :</strong> Les réponses écrites (Writing) et enregistrements oraux (Speaking) de l'étudiant sont enregistrées dans le dashboard d'administration et téléchargeables au format JSON/PDF.</p>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">
            Date de soumission : ${new Date(date).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email à Formations@conseiluxtraining.com:', error)
    return { success: false, error }
  }
}