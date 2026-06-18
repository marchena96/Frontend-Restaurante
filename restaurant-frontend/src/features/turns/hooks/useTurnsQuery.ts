import { useQuery } from '@tanstack/react-query'
import { getTurns } from '../api/turnsApi'

export function useTurnsQuery() {
  return useQuery({
    queryKey: ['turns'],
    queryFn: getTurns,
  })
}
