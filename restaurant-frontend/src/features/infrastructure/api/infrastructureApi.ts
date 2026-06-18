import { httpClient } from '../../../shared/api/httpClient'
import type { RestaurantTable } from '../types/table'

export interface ZoneSummary {
  id: number
  name: string
  tableCount: number
  occupancyPercent: number
}

export interface LayoutData {
  zones: readonly ZoneSummary[]
  tables: readonly RestaurantTable[]
}

export async function getLayout(): Promise<LayoutData> {
  const { data } = await httpClient.get<LayoutData>('/tables/layout')
  return data
}

export async function getTables(): Promise<readonly RestaurantTable[]> {
  const { data } = await httpClient.get<readonly RestaurantTable[]>('/tables')
  return data
}

export async function lockTable(
  tableId: number,
  reason: string,
): Promise<void> {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const startTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const endHour = now.getHours() + 2
  const endTime = `${String(endHour).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  await httpClient.post('/tablelocks', {
    tableId,
    date: today,
    startTime,
    endTime,
    reason,
  })
}

export async function unlockTable(lockId: number): Promise<void> {
  await httpClient.delete(`/tablelocks/${lockId}`)
}

export async function findLockByTableId(
  tableId: number,
): Promise<{ id: number } | undefined> {
  const { data } = await httpClient.get<readonly { id: number; tableId: number }[]>('/tablelocks')
  return data.find((lock) => lock.tableId === tableId)
}

export async function getAvailableTables(
  date: string,
  startTime: string,
  endTime: string,
): Promise<readonly RestaurantTable[]> {
  const { data } = await httpClient.get<readonly RestaurantTable[]>(
    '/tables/available',
    { params: { date, startTime, endTime } },
  )
  return data
}
