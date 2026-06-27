import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { notify } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { addToQueue } from '../api/waitingListApi'
import type { AddToQueuePayload } from '../api/waitingListApi'

export function useAddToQueueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddToQueuePayload) => addToQueue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waitingList.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      notify.success('Grupo agregado a la cola de espera')
    },
    onError: (error) => {
      notify.error(getErrorMessage(error, 'Error al agregar a la cola'))
    },
  })
}
