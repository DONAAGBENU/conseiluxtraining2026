// Test script pour vérifier la conversion snake_case ↔ camelCase
import { listActive } from './lib/supabaseDb'

async function testConversion() {
  console.log('=== Testing Supabase Data Conversion ===\n')
  
  try {
    // Test formations
    console.log('1. Testing formations listActive...')
    const formations = await listActive('formations')
    console.log('Formations result:', formations)
    console.log('Number of formations:', formations.length)
    
    if (formations.length > 0) {
      console.log('\nFirst formation details:')
      const firstFormation = formations[0]
      console.log('- ID:', firstFormation.id)
      console.log('- Titre:', firstFormation.titre)
      console.log('- Has deletedAt:', 'deletedAt' in firstFormation)
      console.log('- Has createdAt:', 'createdAt' in firstFormation)
      console.log('- deletedAt value:', firstFormation.deletedAt)
      console.log('- createdAt value:', firstFormation.createdAt)
    }
    
    // Test dates
    console.log('\n2. Testing dates listActive...')
    const dates = await listActive('dates')
    console.log('Dates result:', dates)
    console.log('Number of dates:', dates.length)
    
    // Test avis
    console.log('\n3. Testing avis listActive...')
    const avis = await listActive('avis')
    console.log('Avis result:', avis)
    console.log('Number of avis:', avis.length)
    
    console.log('\n=== Test Completed ===')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testConversion()