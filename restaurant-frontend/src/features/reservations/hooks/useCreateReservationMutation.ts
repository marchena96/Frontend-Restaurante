import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReservation } from '../api/reservationApi'
import type { ReservationCreateInput } from '../types/reservation'

export function useCreateReservationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReservationCreateInput) =>
      createReservation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
    },
  })
}
