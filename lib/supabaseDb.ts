import { supabase } from './supabaseClient'

export type EntityType = 'formations' | 'dates' | 'avis' | 'leads' | 'messages' | 'analytics'

export const ENTITY_TYPES: EntityType[] = [
  'formations',
  'dates',
  'avis',
  'leads',
  'messages',
]

export const ENTITY_LABELS: Record<EntityType, string> = {
  formations: 'Formations',
  dates: 'Dates de formation',
  avis: 'Avis clients',
  leads: 'Clients (inscriptions / catalogue)',
  messages: 'Messages',
  analytics: 'Statistiques',
}

type RecordItem = Record<string, unknown> & {
  id: string
  deletedAt?: string | null
}

// Table name mapping
const TABLE_NAMES: Record<EntityType, string> = {
  formations: 'formations',
  dates: 'dates',
  avis: 'avis',
  leads: 'leads',
  messages: 'messages',
  analytics: 'analytics',
}

// Mapping camelCase → snake_case pour les colonnes spéciales par table
const COLUMN_TO_DB: Record<string, Record<string, string>> = {
  leads: {
    formationTitre: 'formation_titre',
    contactPreference: 'contact_preference',
  },
  dates: {
    formationId: 'formation_id',
    formationTitre: 'formation_titre',
  },
}

// Mapping snake_case → camelCase pour la lecture depuis DB
const COLUMN_FROM_DB: Record<string, Record<string, string>> = {
  leads: {
    formation_titre: 'formationTitre',
    contact_preference: 'contactPreference',
  },
  dates: {
    formation_id: 'formationId',
    formation_titre: 'formationTitre',
  },
}

/**
 * Convertit un objet JS (camelCase) vers les noms de colonnes DB (snake_case)
 * et supprime les champs camelCase standards (createdAt, deletedAt)
 */
function toDbRecord(type: EntityType, data: Record<string, unknown>): Record<string, unknown> {
  const mapping = COLUMN_TO_DB[type] || {}
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    // Ignorer les champs camelCase gérés séparément
    if (key === 'createdAt' || key === 'deletedAt') continue
    const dbKey = mapping[key] || key
    result[dbKey] = value
  }
  return result
}

/**
 * Convertit un enregistrement DB (snake_case) vers les noms JS (camelCase)
 */
function fromDbRecord(type: EntityType, item: Record<string, unknown>): Record<string, unknown> {
  const mapping = COLUMN_FROM_DB[type] || {}
  const { deleted_at, created_at, ...rest } = item as any
  const result: Record<string, unknown> = {
    deletedAt: deleted_at,
    createdAt: created_at,
  }
  for (const [key, value] of Object.entries(rest)) {
    const jsKey = mapping[key] || key
    result[jsKey] = value
  }
  return result
}

export async function readAll<T extends RecordItem>(type: EntityType): Promise<T[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, falling back to empty array')
      return []
    }

    const tableName = TABLE_NAMES[type]
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error reading ${type}:`, error)
      return []
    }

    const convertedData = (data || []).map((item: any) => fromDbRecord(type, item))
    return convertedData as T[]
  } catch (error) {
    console.error(`Error reading ${type}:`, error)
    return []
  }
}

export async function writeAll<T extends RecordItem>(type: EntityType, items: T[]): Promise<void> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, cannot write data')
      return
    }

    const tableName = TABLE_NAMES[type]
    
    // Delete all existing records
    await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Insert all items
    if (items.length > 0) {
      const { error } = await supabase.from(tableName).insert(items)
      if (error) {
        console.error(`Error writing ${type}:`, error)
      }
    }
  } catch (error) {
    console.error(`Error writing ${type}:`, error)
  }
}

export async function listActive<T extends RecordItem>(type: EntityType): Promise<T[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, falling back to empty array')
      return []
    }

    const tableName = TABLE_NAMES[type]
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error listing active ${type}:`, error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return []
    }

    const convertedData = (data || []).map((item: any) => {
      const record = fromDbRecord(type, item)
      // Fallback si created_at est null
      if (!record.createdAt) record.createdAt = new Date().toISOString()
      return record
    })

    return convertedData as T[]
  } catch (error) {
    console.error(`Error listing active ${type}:`, error)
    return []
  }
}

export async function createItem<T extends RecordItem>(
  type: EntityType,
  data: Omit<T, 'id'> & { id?: string }
): Promise<T | null> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, cannot create item')
      return null
    }

    const tableName = TABLE_NAMES[type]
    
    console.log(`Creating item in ${type} with data:`, data)

    // Convertir les noms camelCase → snake_case pour Supabase
    const dbData = toDbRecord(type, data as any)
    
    const item = {
      ...dbData,
      id: (data as any).id || crypto.randomUUID(),
      deleted_at: null,
      created_at: new Date().toISOString(),
    }

    console.log(`Item to insert in ${type}:`, item)

    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(item)
      .select()
      .single()

    if (error) {
      console.error(`Error creating ${type}:`, error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return null
    }

    console.log(`Successfully created item in ${type}:`, insertedData)

    if (insertedData) {
      return fromDbRecord(type, insertedData as any) as T
    }

    return null
  } catch (error) {
    console.error(`Error creating ${type}:`, error)
    return null
  }
}

export async function updateItem<T extends RecordItem>(
  type: EntityType,
  id: string,
  data: Partial<T>,
  options?: { includeDeleted?: boolean }
): Promise<T | null> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, cannot update item')
      return null
    }

    const tableName = TABLE_NAMES[type]
    // Convertir camelCase → snake_case pour la mise à jour
    const dbData = toDbRecord(type, data as any)
    // Supprimer l'id de la mise à jour
    delete dbData.id

    let query = supabase.from(tableName).update(dbData).eq('id', id)

    if (!options?.includeDeleted) {
      query = query.is('deleted_at', null)
    }

    const { data: updatedData, error } = await query.select().single()

    if (error) {
      console.error(`Error updating ${type}:`, error)
      return null
    }

    if (updatedData) {
      return fromDbRecord(type, updatedData as any) as T
    }

    return null
  } catch (error) {
    console.error(`Error updating ${type}:`, error)
    return null
  }
}

export async function softDelete<T extends RecordItem>(type: EntityType, id: string): Promise<T | null> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, cannot soft delete item')
      return null
    }

    const tableName = TABLE_NAMES[type]

    const { data: deletedData, error } = await supabase
      .from(tableName)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) {
      console.error(`Error soft deleting ${type}:`, error)
      return null
    }

    if (deletedData) {
      return fromDbRecord(type, deletedData as any) as T
    }

    return null
  } catch (error) {
    console.error(`Error soft deleting ${type}:`, error)
    return null
  }
}

export async function restoreItem<T extends RecordItem>(type: EntityType, id: string): Promise<T | null> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, cannot restore item')
      return null
    }

    const tableName = TABLE_NAMES[type]

    const { data: restoredData, error } = await supabase
      .from(tableName)
      .update({ deleted_at: null })
      .eq('id', id)
      .not('deleted_at', 'is', null)
      .select()
      .single()

    if (error) {
      console.error(`Error restoring ${type}:`, error)
      return null
    }

    if (restoredData) {
      return fromDbRecord(type, restoredData as any) as T
    }

    return null
  } catch (error) {
    console.error(`Error restoring ${type}:`, error)
    return null
  }
}

export async function permanentDelete(type: EntityType, id: string): Promise<boolean> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, cannot permanently delete item')
      return false
    }

    const tableName = TABLE_NAMES[type]

    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) {
      console.error(`Error permanently deleting ${type}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error permanently deleting ${type}:`, error)
    return false
  }
}

export async function listTrash() {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, cannot list trash')
      return []
    }

    const items = []

    for (const entityType of ENTITY_TYPES) {
      const tableName = TABLE_NAMES[entityType]
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false })

      if (error) {
        console.error(`Error listing trash for ${entityType}:`, error)
        continue
      }

      if (data && data.length > 0) {
        const convertedData = data.map((item: any) => fromDbRecord(entityType, item))

        items.push(
          ...convertedData.map((item) => ({
            entityType,
            label: ENTITY_LABELS[entityType],
            origin:
              entityType === 'leads'
                ? (item as { source?: string }).source === 'catalogue'
                  ? 'catalogue'
                  : 'inscription'
                : entityType,
            item,
          }))
        )
      }
    }

    return items.sort((a, b) => 
      String(b.item.deletedAt).localeCompare(String(a.item.deletedAt))
    )
  } catch (error) {
    console.error('Error listing trash:', error)
    return []
  }
}