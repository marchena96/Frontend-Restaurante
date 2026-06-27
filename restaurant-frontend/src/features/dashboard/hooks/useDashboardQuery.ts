import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getDashboard } from '../api/dashboardApi'

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: getDashboard,
    refetchInterval: 30_000,
  })
}
