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
            <th style={{ padding: '10px 8px' }}>Cedula</th>
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
                <strong>{`${client.firstName} ${client.lastName}`}</strong>
              </td>
              <td style={{ padding: '10px 8px' }}>{client.phoneNumber}</td>
              <td style={{ padding: '10px 8px' }}>{client.idCard}</td>
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
