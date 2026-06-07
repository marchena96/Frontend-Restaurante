import { useQuery } from '@tanstack/react-query'
import { getClients } from '../api/clientApi'

export function useClientsQuery() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })
}
