import fs from 'fs'
import path from 'path'

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

const DATA_DIR = path.join(process.cwd(), 'data')

function filePath(type: EntityType) {
  return path.join(DATA_DIR, `${type}.json`)
}

function ensureFile(type: EntityType) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  const file = filePath(type)
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]', 'utf-8')
  }
}

export function readAll<T extends RecordItem>(type: EntityType): T[] {
  try {
    ensureFile(type)
    const content = fs.readFileSync(filePath(type), 'utf-8')
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeAll<T extends RecordItem>(type: EntityType, items: T[]) {
  ensureFile(type)
  fs.writeFileSync(filePath(type), JSON.stringify(items, null, 2), 'utf-8')
}

export function listActive<T extends RecordItem>(type: EntityType): T[] {
  return readAll<T>(type).filter((item) => !item.deletedAt)
}

export function createItem<T extends RecordItem>(type: EntityType, data: Omit<T, 'id'> & { id?: string }): T {
  const list = readAll<T>(type)
  const item = {
    ...data,
    id: data.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    deletedAt: null,
  } as T
  list.unshift(item)
  writeAll(type, list)
  return item
}

export function updateItem<T extends RecordItem>(
  type: EntityType,
  id: string,
  data: Partial<T>,
  options?: { includeDeleted?: boolean }
): T | null {
  const list = readAll<T>(type)
  const index = list.findIndex((item) => item.id === id && (options?.includeDeleted || !item.deletedAt))
  if (index === -1) return null
  const { id: _id, deletedAt: _deleted, ...rest } = data as Record<string, unknown>
  list[index] = { ...list[index], ...rest, id }
  writeAll(type, list)
  return list[index]
}

export function softDelete<T extends RecordItem>(type: EntityType, id: string): T | null {
  const list = readAll<T>(type)
  const index = list.findIndex((item) => item.id === id && !item.deletedAt)
  if (index === -1) return null
  list[index] = { ...list[index], deletedAt: new Date().toISOString() }
  writeAll(type, list)
  return list[index]
}

export function restoreItem<T extends RecordItem>(type: EntityType, id: string): T | null {
  const list = readAll<T>(type)
  const index = list.findIndex((item) => item.id === id && !!item.deletedAt)
  if (index === -1) return null
  list[index] = { ...list[index], deletedAt: null }
  writeAll(type, list)
  return list[index]
}

export function permanentDelete(type: EntityType, id: string): boolean {
  const list = readAll(type)
  const next = list.filter((item) => item.id !== id)
  if (next.length === list.length) return false
  writeAll(type, next)
  return true
}

export function listTrash() {
  return ENTITY_TYPES.flatMap((entityType) =>
    readAll(entityType)
      .filter((item) => !!item.deletedAt)
      .map((item) => ({
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
      .sort((a, b) => String(b.item.deletedAt).localeCompare(String(a.item.deletedAt)))
  )
}
