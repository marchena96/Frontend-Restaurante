import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getLayout } from '../api/infrastructureApi'

export function useLocalLayoutQuery() {
  return useQuery({
    queryKey: queryKeys.infrastructure.layout,
    queryFn: getLayout,
  })
}
