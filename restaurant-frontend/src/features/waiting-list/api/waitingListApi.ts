import { httpClient } from '../../../shared/api/httpClient'
import type { WaitingListEntry, WaitingListStatus } from '../types/waitingListEntry'

export interface AddToQueuePayload {
  clientId: number
  partySize: number
  date: string
  startTime: string
  endTime: string
  preferredZone?: string
}

export async function getWaitingList(): Promise<readonly WaitingListEntry[]> {
  const { data } = await httpClient.get<readonly WaitingListEntry[]>('/waitinglist')
  return data
}

export async function addToQueue(
  payload: AddToQueuePayload,
): Promise<WaitingListEntry> {
  const { data } = await httpClient.post<WaitingListEntry>('/waitinglist', payload)
  return data
}

export async function removeFromQueue(id: number): Promise<void> {
  await httpClient.delete(`/waitinglist/${id}`)
}

export async function updateEntryStatus(
  id: number,
  status: WaitingListStatus,
): Promise<void> {
  await httpClient.patch(`/waitinglist/${id}/status`, { status })
}

export async function assignTable(
  entryId: number,
  tableId: number,
): Promise<void> {
  await httpClient.post(`/waitinglist/${entryId}/promote/${tableId}`)
}
