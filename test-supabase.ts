// Script de test pour vérifier la connexion Supabase
import { supabase } from './lib/supabaseClient'

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('Supabase client:', supabase)
    
    if (!supabase) {
      console.error('Supabase client is not available')
      return
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
    } else {
      console.log('Formations found:', formations)
      console.log('Number of formations:', formations?.length)
    }

    // Test dates table
    console.log('\n--- Testing dates table ---')
    const { data: dates, error: datesError } = await supabase
      .from('dates')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (datesError) {
      console.error('Error fetching dates:', datesError)
    } else {
      console.log('Dates found:', dates)
      console.log('Number of dates:', dates?.length)
    }

    // Test avis table
    console.log('\n--- Testing avis table ---')
    const { data: avis, error: avisError } = await supabase
      .from('avis')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (avisError) {
      console.error('Error fetching avis:', avisError)
    } else {
      console.log('Avis found:', avis)
      console.log('Number of avis:', avis?.length)
    }

    console.log('\n--- Test completed ---')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testSupabaseConnection()