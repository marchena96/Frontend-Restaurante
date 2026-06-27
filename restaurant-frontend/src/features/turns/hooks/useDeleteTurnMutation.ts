import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { deleteTurn } from '../api/turnsApi'

export function useDeleteTurnMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTurn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.turns.all })
    },
  })
}
