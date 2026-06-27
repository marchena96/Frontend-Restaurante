import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { notify } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
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
      notify.success('Reserva creada exitosamente')
    },
    onError: (error) => {
      notify.error(getErrorMessage(error, 'Error al crear reserva'))
    },
  })
}
