import { useMemo } from 'react'
import { useClientsQuery } from './useClientsQuery'

export function useClientSearchQuery(query: string) {
  const { data: clients = [], isLoading, error } = useClientsQuery()

  const filtered = useMemo(() => {
    if (!query || query.length < 2) return clients
    const q = query.toLowerCase()
    return clients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.idCard.toLowerCase().includes(q),
    )
  }, [clients, query])

  return { data: filtered, isLoading, error }
}
