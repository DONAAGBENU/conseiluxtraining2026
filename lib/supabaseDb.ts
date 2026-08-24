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

    // Convertir deleted_at en deletedAt pour tous les éléments
    const convertedData = (data || []).map((item: any) => {
      const { deleted_at, created_at, ...rest } = item
      return {
        ...rest,
        deletedAt: deleted_at,
        createdAt: created_at,
      }
    })

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
      return []
    }

    // Convertir deleted_at en deletedAt pour tous les éléments
    const convertedData = (data || []).map((item: any) => {
      const { deleted_at, created_at, ...rest } = item
      return {
        ...rest,
        deletedAt: deleted_at,
        createdAt: created_at,
      }
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
    
    // Convertir deletedAt en deleted_at pour Supabase
    const { deletedAt, ...restData } = data as any
    
    const item = {
      ...restData,
      id: data.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      deleted_at: null,
      created_at: new Date().toISOString(),
    } as unknown as T

    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(item)
      .select()
      .single()

    if (error) {
      console.error(`Error creating ${type}:`, error)
      return null
    }

    // Convertir deleted_at en deletedAt pour le retour
    if (insertedData) {
      const { deleted_at, created_at, ...rest } = insertedData as any
      return {
        ...rest,
        deletedAt: deleted_at,
        createdAt: created_at,
      } as T
    }

    return insertedData as T
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
    const { id: _id, deletedAt, createdAt, ...rest } = data as Record<string, unknown>

    let query = supabase.from(tableName).update(rest).eq('id', id)

    if (!options?.includeDeleted) {
      query = query.is('deleted_at', null)
    }

    const { data: updatedData, error } = await query.select().single()

    if (error) {
      console.error(`Error updating ${type}:`, error)
      return null
    }

    // Convertir deleted_at en deletedAt pour le retour
    if (updatedData) {
      const { deleted_at, created_at, ...rest } = updatedData as any
      return {
        ...rest,
        deletedAt: deleted_at,
        createdAt: created_at,
      } as T
    }

    return updatedData as T
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

    // Convertir deleted_at en deletedAt pour le retour
    if (deletedData) {
      const { deleted_at, created_at, ...rest } = deletedData as any
      return {
        ...rest,
        deletedAt: deleted_at,
        createdAt: created_at,
      } as T
    }

    return deletedData as T
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

    // Convertir deleted_at en deletedAt pour le retour
    if (restoredData) {
      const { deleted_at, created_at, ...rest } = restoredData as any
      return {
        ...rest,
        deletedAt: deleted_at,
        createdAt: created_at,
      } as T
    }

    return restoredData as T
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
        // Convertir deleted_at en deletedAt pour tous les éléments
        const convertedData = data.map((item: any) => {
          const { deleted_at, created_at, ...rest } = item
          return {
            ...rest,
            deletedAt: deleted_at,
            createdAt: created_at,
          }
        })

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