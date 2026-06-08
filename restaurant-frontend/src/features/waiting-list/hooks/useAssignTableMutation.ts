import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignTable } from '../api/waitingListApi'

export function useAssignTableMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      entryId,
      tableId,
    }: {
      entryId: number
      tableId: number
    }) => assignTable(entryId, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-list'] })
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
    },
  })
}
