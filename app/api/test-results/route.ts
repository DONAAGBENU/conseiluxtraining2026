// app/api/test-results/route.ts
// API route pour sauvegarder les résultats des tests de niveau

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const testData = await request.json();
    
    // Créer le dossier data s'il n'existe pas
    const dataDir = join(process.cwd(), 'data');
    try {
      await mkdir(dataDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    // Générer un nom de fichier unique
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `test-result-${timestamp}.json`;
    const filePath = join(dataDir, fileName);

    // Sauvegarder les données
    await writeFile(filePath, JSON.stringify(testData, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true, 
      message: 'Test results saved successfully',
      fileName 
    });
  } catch (error) {
    console.error('Error saving test results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save test results' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data');
    const { readdirSync } = await import('fs');
    
    // Lire tous les fichiers de résultats
    const files = readdirSync(dataDir)
      .filter(file => file.startsWith('test-result-') && file.endsWith('.json'))
      .sort()
      .reverse();

    const results = [];
    for (const file of files) {
      const filePath = join(dataDir, file);
      const { readFile } = await import('fs/promises');
      const content = await readFile(filePath, 'utf-8');
      results.push(JSON.parse(content));
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error reading test results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read test results' },
      { status: 500 }
    );
  }
}