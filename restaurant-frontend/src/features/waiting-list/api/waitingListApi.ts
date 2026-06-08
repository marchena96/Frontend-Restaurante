import { httpClient } from '../../../shared/api/httpClient'
import type { WaitingListEntry, WaitingListStatus } from '../types/waitingListEntry'

export interface AddToQueuePayload {
  clientName: string
  partySize: number
  phoneNumber?: string
  preferredZone?: string
}

export async function getWaitingList(): Promise<readonly WaitingListEntry[]> {
  const { data } = await httpClient.get<readonly WaitingListEntry[]>(
    '/waiting-list',
  )
  return data
}

export async function addToQueue(
  payload: AddToQueuePayload,
): Promise<WaitingListEntry> {
  const { data } = await httpClient.post<WaitingListEntry>(
    '/waiting-list',
    payload,
  )
  return data
}

export async function removeFromQueue(id: number): Promise<void> {
  await httpClient.delete(`/waiting-list/${id}`)
}

export async function updateEntryStatus(
  id: number,
  status: WaitingListStatus,
): Promise<void> {
  await httpClient.patch(`/waiting-list/${id}/status`, { status })
}

export async function assignTable(
  entryId: number,
  tableId: number,
): Promise<void> {
  await httpClient.post(`/waiting-list/${entryId}/assign`, { tableId })
}
