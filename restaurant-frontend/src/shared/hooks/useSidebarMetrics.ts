import { useQueries } from '@tanstack/react-query'
import { getDashboard } from '../../features/dashboard/api/dashboardApi'
import { getLayout } from '../../features/infrastructure/api/infrastructureApi'
import { getTurns } from '../../features/turns/api/turnsApi'
import { getClients } from '../../features/clients/api/clientApi'

export interface SidebarMetrics {
  dashboard: string
  clients: string
  infrastructure: string
  reservations: string
  'waiting-list': string
  turns: string
}

export function useSidebarMetrics(): SidebarMetrics {
  const results = useQueries({
    queries: [
      {
        queryKey: ['dashboard'],
        queryFn: getDashboard,
        refetchInterval: 30_000,
        staleTime: 10_000,
      },
      {
        queryKey: ['tables', 'layout'],
        queryFn: getLayout,
        staleTime: 30_000,
      },
      {
        queryKey: ['turns', 'sidebar'],
        queryFn: getTurns,
        staleTime: 30_000,
      },
      {
        queryKey: ['clients', 'sidebar'],
        queryFn: getClients,
        staleTime: 30_000,
      },
    ],
  })

  const dashboard = results[0].data
  const layout = results[1].data
  const turns = results[2].data
  const clients = results[3].data

  return {
    dashboard: dashboard ? `${dashboard.metrics.occupancyPercent}%` : '\u2026',
    clients: clients ? String(clients.length) : '\u2026',
    infrastructure: layout ? `${layout.tables.length} mesas` : '\u2026',
    reservations: dashboard ? String(dashboard.metrics.activeReservations) : '\u2026',
    'waiting-list': dashboard ? String(dashboard.metrics.waitingListCount) : '\u2026',
    turns: turns ? String(turns.length) : '\u2026',
  }
}
