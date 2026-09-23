import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { supabase as sharedSupabase } from './supabaseClient'

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

const TABLE_NAMES: Record<EntityType, string> = {
  formations: 'formations',
  dates: 'dates',
  avis: 'avis',
  leads: 'leads',
  messages: 'messages',
  analytics: 'analytics',
}

const COLUMN_TO_DB: Record<string, Record<string, string>> = {
  formations: {
    certificationName: 'certification_name',
    publicCible: 'public_cible',
    pointsForts: 'points_forts',
  },
  leads: {
    formationTitre: 'formation_titre',
    contactPreference: 'contact_preference',
  },
  dates: {
    formationId: 'formation_id',
    formationTitre: 'formation_titre',
  },
  avis: {
    texte: 'texte',
    formationTitre: 'formation_titre',
  },
}

const COLUMN_FROM_DB: Record<string, Record<string, string>> = {
  formations: {
    certification_name: 'certificationName',
    public_cible: 'publicCible',
    points_forts: 'pointsForts',
  },
  leads: {
    formation_titre: 'formationTitre',
    contact_preference: 'contactPreference',
  },
  dates: {
    formation_id: 'formationId',
    formation_titre: 'formationTitre',
    date_debut: 'date',
    places_disponibles: 'disponibles',
  },
  avis: {
    formation_titre: 'formationTitre',
    commentaire: 'texte',
  },
}

function getDb(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  if (sharedSupabase) return sharedSupabase

  if (url && anonKey) {
    return createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  throw new Error('Supabase n\'est pas configuré. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

function toDbRecord(type: EntityType, data: Record<string, unknown>): Record<string, unknown> {
  const mapping = COLUMN_TO_DB[type] || {}
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === 'createdAt' || key === 'deletedAt' || key === 'created_at' || key === 'deleted_at') continue
    if (value === undefined) continue
    const dbKey = mapping[key] || key
    result[dbKey] = value
  }
  return result
}

function fromDbRecord(type: EntityType, item: Record<string, unknown>): Record<string, unknown> {
  const mapping = COLUMN_FROM_DB[type] || {}
  const { deleted_at, created_at, commentaire, ...rest } = item as Record<string, unknown> & {
    deleted_at?: string | null
    created_at?: string | null
    commentaire?: string
  }
  const result: Record<string, unknown> = {
    deletedAt: deleted_at ?? null,
    createdAt: created_at || new Date().toISOString(),
  }

  for (const [key, value] of Object.entries(rest)) {
    const jsKey = mapping[key] || key
    if (result[jsKey] === undefined || result[jsKey] === null || result[jsKey] === '') {
      result[jsKey] = value
    }
  }

  if (type === 'avis') {
    if (!result.texte && commentaire) result.texte = commentaire
    if (result.approuve === undefined || result.approuve === null) result.approuve = false
  }

  if (type === 'dates') {
    if (!result.date && rest.date_debut) result.date = rest.date_debut
    if (result.disponibles === undefined && rest.places_disponibles !== undefined) {
      result.disponibles = rest.places_disponibles
    }
  }

  if (type === 'formations') {
    result.modules = Array.isArray(result.modules) ? result.modules : []
    result.certifiante = Boolean(result.certifiante)
    if (Array.isArray(result.pointsForts) === false && result.pointsForts) {
      result.pointsForts = []
    }
  }

  return result
}

function unknownColumn(error: { message?: string; code?: string } | null): string | null {
  const msg = error?.message || ''
  const match =
    msg.match(/Could not find the '([^']+)' column/i) ||
    msg.match(/column [\w.]+\.(\w+) does not exist/i)
  return match?.[1] || null
}

function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: string }).message === 'string') {
    return (error as { message: string }).message
  }
  if (error instanceof Error) return error.message
  return fallback
}

async function mutateWithColumnRetry<T>(
  run: (payload: Record<string, unknown>) => Promise<{ data: T | null; error: { message?: string; code?: string } | null }>,
  payload: Record<string, unknown>
): Promise<T> {
  const current = { ...payload }
  for (let attempt = 0; attempt < 12; attempt++) {
    const { data, error } = await run(current)
    if (!error && data) return data
    const col = unknownColumn(error)
    if (col && col in current) {
      delete current[col]
      continue
    }
    throw new Error(errorMessage(error, 'Erreur base de données'))
  }
  throw new Error('Trop de colonnes inconnues pour enregistrer cette donnée')
}

export async function readAll<T extends RecordItem>(type: EntityType): Promise<T[]> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]
  const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false })

  if (error) {
    const unordered = await supabase.from(tableName).select('*')
    if (unordered.error) {
      console.error(`Error reading ${type}:`, unordered.error)
      throw new Error(unordered.error.message)
    }
    return (unordered.data || []).map((item: Record<string, unknown>) => fromDbRecord(type, item)) as T[]
  }

  return (data || []).map((item: Record<string, unknown>) => fromDbRecord(type, item)) as T[]
}

export async function writeAll<T extends RecordItem>(type: EntityType, items: T[]): Promise<void> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]
  await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (items.length > 0) {
    const rows = items.map((item) => {
      const dbData = toDbRecord(type, item as Record<string, unknown>)
      return {
        ...dbData,
        id: item.id,
        deleted_at: item.deletedAt ?? null,
      }
    })
    const { error } = await supabase.from(tableName).insert(rows)
    if (error) throw new Error(error.message)
  }
}

export async function listActive<T extends RecordItem>(type: EntityType): Promise<T[]> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]
  let query = supabase.from(tableName).select('*').is('deleted_at', null)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) {
    const fallback = await supabase.from(tableName).select('*').is('deleted_at', null)
    if (fallback.error) {
      console.error(`Error listing active ${type}:`, fallback.error)
      throw new Error(fallback.error.message)
    }
    return (fallback.data || []).map((item: Record<string, unknown>) => fromDbRecord(type, item)) as T[]
  }

  return (data || []).map((item: Record<string, unknown>) => fromDbRecord(type, item)) as T[]
}

export async function createItem<T extends RecordItem>(
  type: EntityType,
  data: Omit<T, 'id'> & { id?: string }
): Promise<T> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]
  const dbData = toDbRecord(type, data as Record<string, unknown>)
  const item = {
    ...dbData,
    id: (data as { id?: string }).id || crypto.randomUUID(),
    deleted_at: null,
    created_at: new Date().toISOString(),
  }

  const insertedData = await mutateWithColumnRetry(async (payload) => {
    return supabase.from(tableName).insert(payload).select().single()
  }, item)

  return fromDbRecord(type, insertedData as unknown as Record<string, unknown>) as T
}

export async function updateItem<T extends RecordItem>(
  type: EntityType,
  id: string,
  data: Partial<T>,
  options?: { includeDeleted?: boolean }
): Promise<T | null> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]
  const dbData = toDbRecord(type, data as Record<string, unknown>)
  delete dbData.id

  try {
    const updatedData = await mutateWithColumnRetry(async (payload) => {
      let query = supabase.from(tableName).update(payload).eq('id', id)
      if (!options?.includeDeleted) {
        query = query.is('deleted_at', null)
      }
      return query.select().single()
    }, dbData)
    return fromDbRecord(type, updatedData as unknown as Record<string, unknown>) as T
  } catch (error) {
    console.error(`Error updating ${type}:`, error)
    return null
  }
}

export async function softDelete<T extends RecordItem>(type: EntityType, id: string): Promise<T | null> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]

  const { data: deletedData, error } = await supabase
    .from(tableName)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (!error && deletedData) {
    return fromDbRecord(type, deletedData as Record<string, unknown>) as T
  }

  const col = unknownColumn(error)
  if (col === 'deleted_at' || error?.code === 'PGRST116') {
    const ok = await permanentDelete(type, id)
    return ok ? ({ id, deletedAt: new Date().toISOString() } as T) : null
  }

  console.error(`Error soft deleting ${type}:`, error)
  return null
}

export async function restoreItem<T extends RecordItem>(type: EntityType, id: string): Promise<T | null> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]

  const { data: restoredData, error } = await supabase
    .from(tableName)
    .update({ deleted_at: null })
    .eq('id', id)
    .not('deleted_at', 'is', null)
    .select()
    .single()

  if (error || !restoredData) {
    console.error(`Error restoring ${type}:`, error)
    return null
  }

  return fromDbRecord(type, restoredData as Record<string, unknown>) as T
}

export async function permanentDelete(type: EntityType, id: string): Promise<boolean> {
  const supabase = getDb()
  const tableName = TABLE_NAMES[type]
  const { error, data } = await supabase.from(tableName).delete().eq('id', id).select('id')

  if (error) {
    console.error(`Error permanently deleting ${type}:`, error)
    return false
  }

  return Array.isArray(data) ? data.length > 0 : true
}

export async function listTrash() {
  const supabase = getDb()
  const items: Array<{
    entityType: EntityType
    label: string
    origin: string
    item: Record<string, unknown>
  }> = []

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
      const convertedData = data.map((item: Record<string, unknown>) => fromDbRecord(entityType, item))
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

  return items.sort((a, b) => String(b.item.deletedAt).localeCompare(String(a.item.deletedAt)))
}
