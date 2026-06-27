import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getReservations } from '../api/reservationApi'

export function useReservationsQuery() {
  return useQuery({
    queryKey: queryKeys.reservations.all,
    queryFn: getReservations,
  })
}
