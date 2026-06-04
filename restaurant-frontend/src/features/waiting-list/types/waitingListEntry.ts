import type { EntityId } from '../../../shared/types'

export type WaitingListStatus = 'EnEspera' | 'Asignado' | 'Cancelado'

export interface WaitingListEntry {
  id: EntityId
  clientName: string
  partySize: number
  status: WaitingListStatus
  arrivedAt: string
  preferredZone?: string
}
