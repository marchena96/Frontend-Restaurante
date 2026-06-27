import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { createTurn } from '../api/turnsApi'
import type { TurnFormInput } from '../types/turn'

export function useCreateTurnMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TurnFormInput) => createTurn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.turns.all })
    },
  })
}
