import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getClients } from '../api/clientApi'

export function useClientsQuery() {
  return useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: getClients,
  })
}
