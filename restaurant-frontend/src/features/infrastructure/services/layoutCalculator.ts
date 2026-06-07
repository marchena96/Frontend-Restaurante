import type { RestaurantTable } from '../types/table'

export function groupTablesByZone(
  tables: readonly RestaurantTable[],
  filterZone?: string | null,
): Record<string, readonly RestaurantTable[]> {
  const filtered = filterZone
    ? tables.filter((t) => t.zoneName === filterZone)
    : tables

  const groups: Record<string, RestaurantTable[]> = {}

  for (const table of filtered) {
    if (!groups[table.zoneName]) {
      groups[table.zoneName] = []
    }
    groups[table.zoneName].push(table)
  }

  return groups
}

export function getTableStatusCounts(
  tables: readonly RestaurantTable[],
): Record<string, number> {
  const counts: Record<string, number> = {
    Libre: 0,
    Ocupada: 0,
    Reservada: 0,
    Bloqueada: 0,
  }
  for (const table of tables) {
    counts[table.status] = (counts[table.status] ?? 0) + 1
  }
  return counts
}

export function getTablesByCapacity(
  tables: readonly RestaurantTable[],
  minCapacity: number,
): readonly RestaurantTable[] {
  return tables.filter((t) => t.capacity >= minCapacity && t.status === 'Libre')
}
