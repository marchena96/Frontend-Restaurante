import { httpClient } from '../../../shared/api/httpClient'
import type {
  ReservationCreateInput,
  ReservationResponse,
  ReservationStatus,
} from '../types/reservation'

const statusToId: Record<ReservationStatus, number> = {
  Pendiente: 2,
  Confirmada: 1,
  Completada: 3,
  Cancelada: 4,
}

export async function getReservations(): Promise<
  readonly ReservationResponse[]
> {
  const { data } = await httpClient.get<readonly ReservationResponse[]>(
    '/reservations',
  )
  return data
}

export async function getReservation(
  id: number,
): Promise<ReservationResponse> {
  const { data } = await httpClient.get<ReservationResponse>(
    `/reservations/${id}`,
  )
  return data
}

export async function createReservation(
  payload: ReservationCreateInput,
): Promise<ReservationResponse> {
  const { data } = await httpClient.post<ReservationResponse>(
    '/reservations',
    payload,
  )
  return data
}

export async function updateReservationStatus(
  id: number,
  status: ReservationStatus,
): Promise<void> {
  const statusId = statusToId[status]
  await httpClient.put(`/reservations/${id}/status/${statusId}`)
}

export async function getReservationsByDate(
  date: string,
): Promise<readonly ReservationResponse[]> {
  const { data } = await httpClient.get<readonly ReservationResponse[]>(
    '/reservations',
    { params: { date } },
  )
  return data
}
