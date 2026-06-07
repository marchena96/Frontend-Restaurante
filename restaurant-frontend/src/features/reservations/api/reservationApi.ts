import { httpClient } from '../../../shared/api/httpClient'
import type {
  ReservationCreateInput,
  ReservationResponse,
  ReservationStatus,
} from '../types/reservation'

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
  await httpClient.patch(`/reservations/${id}/status`, { status })
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
