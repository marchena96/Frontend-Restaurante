import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  sortByArrival,
  getWaitingTimeMinutes,
  formatWaitingTime,
  findBestTableMatch,
  getQueueSummary,
} from '../queuePrioritizer'
import type { WaitingListEntry } from '@/features/waiting-list/types/waitingListEntry'
import type { RestaurantTable } from '@/features/infrastructure/types/table'

afterEach(() => {
  vi.restoreAllMocks()
})

const makeEntry = (overrides: Partial<WaitingListEntry> = {}): WaitingListEntry => ({
  id: 1,
  clientName: 'Test',
  partySize: 2,
  status: 'EnEspera',
  arrivedAt: '2026-06-18T10:00:00',
  ...overrides,
})

const makeTable = (overrides: Partial<RestaurantTable> = {}): RestaurantTable => ({
  id: 1,
  tableNumber: 'T1',
  capacity: 4,
  status: 'Libre',
  zoneName: 'Terrace',
  ...overrides,
})

describe('sortByArrival', () => {
  it('sorts entries by arrival time ascending', () => {
    const early = makeEntry({ id: 1, arrivedAt: '2026-06-18T09:00:00' })
    const late = makeEntry({ id: 2, arrivedAt: '2026-06-18T11:00:00' })
    const mid = makeEntry({ id: 3, arrivedAt: '2026-06-18T10:00:00' })

    const sorted = sortByArrival([late, early, mid])

    expect(sorted[0].id).toBe(1)
    expect(sorted[1].id).toBe(3)
    expect(sorted[2].id).toBe(2)
  })

  it('does not mutate the original array', () => {
    const early = makeEntry({ id: 1, arrivedAt: '2026-06-18T09:00:00' })
    const late = makeEntry({ id: 2, arrivedAt: '2026-06-18T11:00:00' })
    const original = [late, early]

    sortByArrival(original)

    expect(original[0].id).toBe(2)
    expect(original[1].id).toBe(1)
  })

  it('returns empty array for empty input', () => {
    expect(sortByArrival([])).toEqual([])
  })
})

describe('getWaitingTimeMinutes', () => {
  it('returns 0 for entry that just arrived', () => {
    const now = new Date()
    const entry = makeEntry({ arrivedAt: now.toISOString() })

    const result = getWaitingTimeMinutes(entry)

    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThan(1)
  })

  it('returns positive minutes for past arrival', () => {
    const past = new Date(Date.now() - 30 * 60 * 1000)
    const entry = makeEntry({ arrivedAt: past.toISOString() })

    const result = getWaitingTimeMinutes(entry)

    expect(result).toBeGreaterThanOrEqual(29)
    expect(result).toBeLessThanOrEqual(31)
  })
})

describe('formatWaitingTime', () => {
  it('formats 0 minutes as "Ahora"', () => {
    expect(formatWaitingTime(0)).toBe('Ahora')
  })

  it('formats 5 minutes', () => {
    expect(formatWaitingTime(5)).toBe('5 min')
  })

  it('formats 60 minutes as 1h', () => {
    expect(formatWaitingTime(60)).toBe('1h')
  })

  it('formats 90 minutes as 1h 30m', () => {
    expect(formatWaitingTime(90)).toBe('1h 30m')
  })

  it('formats 120 minutes as 2h', () => {
    expect(formatWaitingTime(120)).toBe('2h')
  })
})

describe('findBestTableMatch', () => {
  it('returns the smallest adequate table for the group', () => {
    const entry = makeEntry({ partySize: 3 })
    const tables = [
      makeTable({ id: 1, capacity: 2 }),
      makeTable({ id: 2, capacity: 4 }),
      makeTable({ id: 3, capacity: 6 }),
    ]

    const result = findBestTableMatch(entry, tables)

    expect(result?.id).toBe(2)
  })

  it('returns undefined when no table has enough capacity', () => {
    const entry = makeEntry({ partySize: 10 })
    const tables = [makeTable({ id: 1, capacity: 4 })]

    const result = findBestTableMatch(entry, tables)

    expect(result).toBeUndefined()
  })

  it('prefers tables in the preferred zone', () => {
    const entry = makeEntry({ partySize: 2, preferredZone: 'VIP' })
    const tables = [
      makeTable({ id: 1, capacity: 4, zoneName: 'Terrace' }),
      makeTable({ id: 2, capacity: 2, zoneName: 'VIP' }),
    ]

    const result = findBestTableMatch(entry, tables)

    expect(result?.id).toBe(2)
  })

  it('ignores tables that are not "Libre"', () => {
    const entry = makeEntry({ partySize: 2 })
    const tables = [
      makeTable({ id: 1, capacity: 4, status: 'Ocupada' }),
      makeTable({ id: 2, capacity: 4, status: 'Libre' }),
    ]

    const result = findBestTableMatch(entry, tables)

    expect(result?.id).toBe(2)
  })

  it('returns undefined for empty table list', () => {
    const entry = makeEntry({ partySize: 2 })

    const result = findBestTableMatch(entry, [])

    expect(result).toBeUndefined()
  })
})

describe('getQueueSummary', () => {
  it('summarizes active entries correctly', () => {
    const entries = [
      makeEntry({ id: 1, partySize: 2, arrivedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() }),
      makeEntry({ id: 2, partySize: 2, arrivedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() }),
      makeEntry({ id: 3, partySize: 4, arrivedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() }),
      makeEntry({ id: 4, partySize: 2, status: 'Asignado' }),
    ]

    const summary = getQueueSummary(entries)

    expect(summary.total).toBe(3)
    expect(summary.byPartySize[2]).toBe(2)
    expect(summary.byPartySize[4]).toBe(1)
    expect(summary.avgWaitMinutes).toBeGreaterThan(0)
  })

  it('returns zero summary for empty input', () => {
    const summary = getQueueSummary([])

    expect(summary.total).toBe(0)
    expect(summary.avgWaitMinutes).toBe(0)
    expect(summary.byPartySize).toEqual({})
  })
})
