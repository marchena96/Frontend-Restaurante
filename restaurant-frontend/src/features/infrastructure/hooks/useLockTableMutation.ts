import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lockTable, unlockTable } from '../api/infrastructureApi'

export function useLockTableMutation() {
  const queryClient = useQueryClient()

  const lock = useMutation({
    mutationFn: ({ tableId, reason }: { tableId: number; reason: string }) =>
      lockTable(tableId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
    },
  })

  const unlock = useMutation({
    mutationFn: (tableId: number) => unlockTable(tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
    },
  })

  return { lock, unlock }
}
