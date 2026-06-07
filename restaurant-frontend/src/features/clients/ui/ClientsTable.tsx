import type { ClientResponse } from '../types/client'
import type { ReactNode } from 'react'

interface ClientsTableProps {
  clients: readonly ClientResponse[] | undefined
  isLoading: boolean
  actions?: (client: ClientResponse) => ReactNode
}

export function ClientsTable({
  clients,
  isLoading,
  actions,
}: ClientsTableProps) {
  if (isLoading) {
    return <p className="text-muted">Cargando comensales...</p>
  }

  if (!clients || clients.length === 0) {
    return <p className="text-muted">No hay comensales registrados.</p>
  }

  return (
    <div className="operations-panel" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '10px 8px' }}>Nombre</th>
            <th style={{ padding: '10px 8px' }}>Telefono</th>
            <th style={{ padding: '10px 8px' }}>Email</th>
            <th style={{ padding: '10px 8px' }}>Visitas</th>
            <th style={{ padding: '10px 8px' }}>Ultima visita</th>
            {actions && <th style={{ padding: '10px 8px' }}>Accion</th>}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <td style={{ padding: '10px 8px' }}>
                <strong>{client.fullName}</strong>
              </td>
              <td style={{ padding: '10px 8px' }}>{client.phoneNumber}</td>
              <td style={{ padding: '10px 8px' }}>
                {client.email ?? '---'}
              </td>
              <td style={{ padding: '10px 8px' }}>{client.visitCount}</td>
              <td style={{ padding: '10px 8px' }}>
                {client.lastVisitAt
                  ? new Date(client.lastVisitAt).toLocaleDateString()
                  : '---'}
              </td>
              {actions && (
                <td style={{ padding: '10px 8px' }}>{actions(client)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
