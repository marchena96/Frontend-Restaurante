import { z } from 'zod'

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
