import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../api/dashboardApi'

export function useDashboardQuery() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    refetchInterval: 30_000,
  })
}
