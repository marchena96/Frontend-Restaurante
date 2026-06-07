import { useQuery } from '@tanstack/react-query'
import { getLayout } from '../api/infrastructureApi'

export function useLocalLayoutQuery() {
  return useQuery({
    queryKey: ['infrastructure', 'layout'],
    queryFn: getLayout,
  })
}
