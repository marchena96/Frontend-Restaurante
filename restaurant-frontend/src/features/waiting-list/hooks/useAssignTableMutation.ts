import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { notify } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
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
      queryClient.invalidateQueries({ queryKey: queryKeys.waitingList.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.infrastructure.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      notify.success('Mesa asignada exitosamente')
    },
    onError: (error) => {
      notify.error(getErrorMessage(error, 'Error al asignar mesa'))
    },
  })
}
