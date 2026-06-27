import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { createReservation } from '../api/reservationApi'
import type { ReservationCreateInput } from '../forms/reservationSchema'

export function useCreateReservationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReservationCreateInput) =>
      createReservation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.infrastructure.all })
    },
  })
}
