import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { addToQueue } from '../api/waitingListApi'
import type { AddToQueuePayload } from '../api/waitingListApi'

export function useAddToQueueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddToQueuePayload) => addToQueue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waitingList.all })
    },
  })
}
