import type { EntityId, IsoDate, TimeOnly } from '@/shared/types'

export type ReservationStatus =
  | 'Pendiente'
  | 'Confirmada'
  | 'Cancelada'
  | 'Completada'

export interface ReservationResponse {
  id: EntityId
  date: IsoDate
  reservationTime: TimeOnly
  guestCount: number
  status: ReservationStatus
  createdAt: string
  clientId: EntityId
  clientName: string
  tableId: EntityId
  tableNumber: string
  zoneName: string
  turnId: EntityId
  turnName: string
}
