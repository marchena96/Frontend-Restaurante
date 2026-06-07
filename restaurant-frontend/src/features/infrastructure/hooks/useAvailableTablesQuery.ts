import { useQuery } from '@tanstack/react-query'
import { getAvailableTables } from '../api/infrastructureApi'

export function useAvailableTablesQuery(
  guestCount: number,
  date: string,
  time: string,
) {
  return useQuery({
    queryKey: ['infrastructure', 'tables', 'available', guestCount, date, time],
    queryFn: () => getAvailableTables(guestCount, date, time),
    enabled: guestCount > 0 && date.length > 0 && time.length > 0,
  })
}
