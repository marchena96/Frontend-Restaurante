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
  const { data } = await httpClient.get<LayoutData>('/infrastructure/layout')
  return data
}

export async function getTables(): Promise<readonly RestaurantTable[]> {
  const { data } = await httpClient.get<readonly RestaurantTable[]>(
    '/infrastructure/tables',
  )
  return data
}

export async function lockTable(
  tableId: number,
  reason: string,
): Promise<void> {
  await httpClient.post(`/infrastructure/tables/${tableId}/lock`, { reason })
}

export async function unlockTable(tableId: number): Promise<void> {
  await httpClient.post(`/infrastructure/tables/${tableId}/unlock`)
}

export async function getAvailableTables(
  guestCount: number,
  date: string,
  time: string,
): Promise<readonly RestaurantTable[]> {
  const { data } = await httpClient.get<readonly RestaurantTable[]>(
    '/infrastructure/tables/available',
    { params: { guestCount, date, time } },
  )
  return data
}
