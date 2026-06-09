import type { ReservationResponse } from '../types/reservation'

interface HistoryLogProps {
  reservations: readonly ReservationResponse[] | undefined
  isLoading: boolean
}

export function HistoryLog({ reservations, isLoading }: HistoryLogProps) {
  if (isLoading) {
    return <p className="text-muted">Cargando historial...</p>
  }

  if (!reservations || reservations.length === 0) {
    return <p className="text-muted">No hay historial de reservas.</p>
  }

  const sorted = [...reservations].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="operations-panel overflow-x-auto">
      <table className="table-data">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Mesa</th>
            <th>Invitados</th>
            <th>Estado</th>
            <th>Creada</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.clientName}</td>
              <td>{r.tableNumber} ({r.zoneName})</td>
              <td>{r.guestCount}</td>
              <td>
                <span
                  className="status-badge"
                  style={{
                    background:
                      r.status === 'Completada'
                        ? 'var(--accent)'
                        : r.status === 'Cancelada'
                          ? '#6b7280'
                          : r.status === 'Confirmada'
                            ? '#3b82f6'
                            : 'var(--warning)',
                  }}
                >
                  {r.status}
                </span>
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
