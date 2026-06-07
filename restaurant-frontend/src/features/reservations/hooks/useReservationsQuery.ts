import { useQuery } from '@tanstack/react-query'
import { getReservations } from '../api/reservationApi'

export function useReservationsQuery() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
  })
}
