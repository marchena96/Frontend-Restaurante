import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAvailableTables } from '../api/infrastructureApi'

export function useAvailableTablesQuery(
  date: string,
  startTime: string,
  endTime: string,
) {
  return useQuery({
    queryKey: queryKeys.infrastructure.tables.available(date, startTime, endTime),
    queryFn: () => getAvailableTables(date, startTime, endTime),
    enabled: date.length > 0 && startTime.length > 0 && endTime.length > 0,
  })
}
