import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getWaitingList } from '../api/waitingListApi'

export function useWaitingListQuery() {
  return useQuery({
    queryKey: queryKeys.waitingList.all,
    queryFn: getWaitingList,
    refetchInterval: 15000,
  })
}
