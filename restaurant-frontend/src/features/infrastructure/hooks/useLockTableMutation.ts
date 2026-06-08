import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lockTable, unlockTable, findLockByTableId } from '../api/infrastructureApi'

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
    mutationFn: async (tableId: number) => {
      const lock = await findLockByTableId(tableId)
      if (!lock) throw new Error('No active lock found for this table')
      await unlockTable(lock.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
    },
  })

  return { lock, unlock }
}
