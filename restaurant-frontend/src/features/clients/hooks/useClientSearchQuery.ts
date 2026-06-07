import { useQuery } from '@tanstack/react-query'
import { searchClients } from '../api/clientApi'

export function useClientSearchQuery(query: string) {
  return useQuery({
    queryKey: ['clients', 'search', query],
    queryFn: () => searchClients(query),
    enabled: query.length >= 2,
    staleTime: 10000,
  })
}
