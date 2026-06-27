import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getTurns } from '../api/turnsApi'

export function useTurnsQuery() {
  return useQuery({
    queryKey: queryKeys.turns.all,
    queryFn: getTurns,
  })
}
