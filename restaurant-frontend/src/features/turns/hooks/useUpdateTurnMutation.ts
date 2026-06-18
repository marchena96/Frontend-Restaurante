import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTurn } from '../api/turnsApi'
import type { TurnFormInput } from '../types/turn'

export function useUpdateTurnMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TurnFormInput }) =>
      updateTurn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] })
    },
  })
}
