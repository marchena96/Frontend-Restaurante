import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { removeFromQueue } from '../api/waitingListApi'

export function useRemoveFromQueueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => removeFromQueue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waitingList.all })
    },
  })
}
