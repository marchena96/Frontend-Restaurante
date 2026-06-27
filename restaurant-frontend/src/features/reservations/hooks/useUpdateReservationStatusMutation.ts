import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { updateReservationStatus } from '../api/reservationApi'
import type { ReservationStatus } from '../types/reservation'

export function useUpdateReservationStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: ReservationStatus
    }) => updateReservationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.infrastructure.all })
    },
  })
}
