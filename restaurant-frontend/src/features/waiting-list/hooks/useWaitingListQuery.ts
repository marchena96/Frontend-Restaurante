import { useQuery } from '@tanstack/react-query'
import { getWaitingList } from '../api/waitingListApi'

export function useWaitingListQuery() {
  return useQuery({
    queryKey: ['waiting-list'],
    queryFn: getWaitingList,
    refetchInterval: 15000,
  })
}
