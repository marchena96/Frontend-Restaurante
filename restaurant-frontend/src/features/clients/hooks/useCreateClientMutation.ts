import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { notify } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { createClient } from '../api/clientApi'
import type { Client } from '../types/client'

export function useCreateClientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<Client, 'id'>) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      notify.success('Comensal registrado exitosamente')
    },
    onError: (error) => {
      notify.error(getErrorMessage(error, 'Error al registrar comensal'))
    },
  })
}
