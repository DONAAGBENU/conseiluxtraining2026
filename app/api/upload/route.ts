import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseStorageClient } from '@/lib/supabaseStorage'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const storageClient = getSupabaseStorageClient()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'L\'image ne doit pas dépasser 5MB' }, { status: 400 })
    }

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `formations/${fileName}`

    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Uploader vers Supabase Storage
    const { error } = await storageClient.storage
      .from('formations-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Erreur upload Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 })
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = storageClient.storage
      .from('formations-images')
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      path: filePath
    })

  } catch (error) {
    console.error('Erreur upload image:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
