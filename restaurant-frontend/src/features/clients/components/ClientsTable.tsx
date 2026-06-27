import { SkeletonRow } from '@/shared/components/Skeleton'
import type { Client } from '../types/client'
import type { ReactNode } from 'react'

interface ClientsTableProps {
  clients: readonly Client[] | undefined
  isLoading: boolean
  actions?: (client: Client) => ReactNode
}

export function ClientsTable({
  clients,
  isLoading,
  actions,
}: ClientsTableProps) {
  if (isLoading) {
    return (
      <div className="operations-panel">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    )
  }

  if (!clients || clients.length === 0) {
    return <p className="text-muted">No hay comensales registrados.</p>
  }

  return (
    <div className="operations-panel overflow-x-auto">
      <table className="table-data">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Cedula</th>
            {actions && <th>Accion</th>}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td><strong>{`${client.firstName} ${client.lastName}`}</strong></td>
              <td>{client.phoneNumber}</td>
              <td>{client.idCard}</td>
              {actions && <td>{actions(client)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
