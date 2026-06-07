import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '../api/clientApi'
import type { CreateClientPayload } from '../api/clientApi'

export function useCreateClientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateClientPayload) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
