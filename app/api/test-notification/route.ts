// app/api/test-notification/route.ts
// API route pour envoyer des notifications email et enregistrer la notification d'administration

import { NextRequest, NextResponse } from 'next/server';
import { sendTestLevelNotification } from '../../../lib/emailService';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { studentData, result, date, testName } = await request.json();

    // Tenter l'envoi d'email au destinataire Formations@conseiluxtraining.com
    const emailResult = await sendTestLevelNotification(studentData, result, date);

    // Sauvegarder également une copie de la notification dans data/ pour l'administration
    try {
      const dataDir = join(process.cwd(), 'data');
      await mkdir(dataDir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const notificationPath = join(dataDir, `notification-${timestamp}.json`);
      await writeFile(notificationPath, JSON.stringify({
        recipient: 'Formations@conseiluxtraining.com',
        studentData,
        result,
        testName,
        date,
        emailSent: emailResult.success
      }, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Unable to write fallback notification file:', fsErr);
    }

    return NextResponse.json({ 
      success: true, 
      emailSent: emailResult.success,
      message: 'Test notification processed successfully' 
    });
  } catch (error) {
    console.error('Error processing test notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process test notification' },
      { status: 500 }
    );
  }
}