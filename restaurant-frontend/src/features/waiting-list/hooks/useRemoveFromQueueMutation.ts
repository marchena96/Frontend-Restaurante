import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { notify } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { removeFromQueue } from '../api/waitingListApi'

export function useRemoveFromQueueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => removeFromQueue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waitingList.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      notify.success('Grupo removido de la cola')
    },
    onError: (error) => {
      notify.error(getErrorMessage(error, 'Error al remover de la cola'))
    },
  })
}
