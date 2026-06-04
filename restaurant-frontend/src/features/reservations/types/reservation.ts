import { z } from 'zod'
import type { EntityId, IsoDate, TimeOnly } from '../../../shared/types'

export const reservationSchema = z.object({
  clientId: z.number().positive('Debe seleccionar un cliente'),
  tableId: z.number().positive('Debe seleccionar una mesa'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha requerida (YYYY-MM-DD)'),
  reservationTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora requerida (HH:mm)'),
  guestCount: z.number().min(1, 'Minimo 1 invitado'),
})

export type ReservationCreateInput = z.infer<typeof reservationSchema>

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
