import { NextRequest, NextResponse } from 'next/server'
import { permanentDelete, softDelete, updateItem } from '@/lib/jsonDb'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    let body: Record<string, unknown> = {}
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const hasUpdateFields = ['nom', 'email', 'telephone', 'sujet', 'message'].some((key) => key in body)

    const message = hasUpdateFields
      ? updateItem('messages', id, body)
      : updateItem('messages', id, { lu: body.lu !== undefined ? body.lu : true })

    if (!message) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Erreur PUT /api/messages/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    if (permanent) {
      const ok = permanentDelete('messages', id)
      if (!ok) return NextResponse.json({ error: 'Message introuvable' }, { status: 404 })
      return NextResponse.json({ success: true })
    }

    const message = softDelete('messages', id)
    if (!message) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE /api/messages/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
