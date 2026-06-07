import { useMutation, useQueryClient } from '@tanstack/react-query'
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
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
    },
  })
}
