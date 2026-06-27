import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { notify } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { deleteTurn } from '../api/turnsApi'

export function useDeleteTurnMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTurn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.turns.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      notify.success('Turno eliminado exitosamente')
    },
    onError: (error) => {
      notify.error(getErrorMessage(error, 'Error al eliminar turno'))
    },
  })
}
