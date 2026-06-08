import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeFromQueue } from '../api/waitingListApi'

export function useRemoveFromQueueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => removeFromQueue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-list'] })
    },
  })
}
