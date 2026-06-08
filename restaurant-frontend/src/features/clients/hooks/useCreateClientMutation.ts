import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '../api/clientApi'
import type { Client } from '../types/client'

export function useCreateClientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<Client, 'id'>) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
