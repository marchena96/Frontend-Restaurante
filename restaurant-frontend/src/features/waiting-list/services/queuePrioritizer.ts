import type { WaitingListEntry } from '../types/waitingListEntry'
import type { RestaurantTable } from '../../infrastructure/types/table'

export function sortByArrival(
  entries: readonly WaitingListEntry[],
): readonly WaitingListEntry[] {
  return [...entries].sort(
    (a, b) => new Date(a.arrivedAt).getTime() - new Date(b.arrivedAt).getTime(),
  )
}

export function getWaitingTimeMinutes(entry: WaitingListEntry): number {
  const now = Date.now()
  const arrived = new Date(entry.arrivedAt).getTime()
  return Math.floor((now - arrived) / 60000)
}

export function formatWaitingTime(minutes: number): string {
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function findBestTableMatch(
  entry: WaitingListEntry,
  availableTables: readonly RestaurantTable[],
): RestaurantTable | undefined {
  const candidates = availableTables.filter(
    (t) =>
      t.status === 'Libre' &&
      t.capacity >= entry.partySize &&
      (!entry.preferredZone || t.zoneName === entry.preferredZone),
  )

  candidates.sort(
    (a, b) => a.capacity - b.capacity,
  )

  return candidates[0]
}

export function getQueueSummary(
  entries: readonly WaitingListEntry[],
): { total: number; avgWaitMinutes: number; byPartySize: Record<number, number> } {
  const active = entries.filter((e) => e.status === 'EnEspera')
  const total = active.length
  const byPartySize: Record<number, number> = {}

  let totalMinutes = 0
  for (const entry of active) {
    totalMinutes += getWaitingTimeMinutes(entry)
    byPartySize[entry.partySize] = (byPartySize[entry.partySize] ?? 0) + 1
  }

  return {
    total,
    avgWaitMinutes: total > 0 ? Math.round(totalMinutes / total) : 0,
    byPartySize,
  }
}
