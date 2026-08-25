import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    console.log('Supabase client:', supabase)
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client is not available' }, { status: 500 })
    }

    // Test formations table
    console.log('\n--- Testing formations table ---')
    const { data: formations, error: formationsError } = await supabase
      .from('formations')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (formationsError) {
      console.error('Error fetching formations:', formationsError)
      return NextResponse.json({ error: 'Error fetching formations', details: formationsError }, { status: 500 })
    }

    console.log('Formations found:', formations)
    console.log('Number of formations:', formations?.length)

    // Test create formation
    console.log('\n--- Testing create formation ---')
    const testFormation = {
      titre: 'Test Formation',
      description: 'This is a test formation',
      categorie: 'Technologie numérique',
      duree: '5 jours',
      prix: '500000 FCFA',
      certifiante: true,
      modules: ['Module 1', 'Module 2'],
      objectif: 'Test objective',
      prerequis: 'Test prerequis',
    }

    const { data: createdFormation, error: createError } = await supabase
      .from('formations')
      .insert(testFormation)
      .select()
      .single()

    if (createError) {
      console.error('Error creating test formation:', createError)
      return NextResponse.json({ 
        error: 'Error creating test formation', 
        details: createError,
        formations: formations 
      }, { status: 500 })
    }

    console.log('Test formation created:', createdFormation)

    // Clean up test formation
    await supabase.from('formations').delete().eq('id', createdFormation.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      formations: formations,
      test: createdFormation
    })
  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json({ error: 'Test failed', details: error }, { status: 500 })
  }
}