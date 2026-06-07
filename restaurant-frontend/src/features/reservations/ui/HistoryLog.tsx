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
    <div className="operations-panel" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              textAlign: 'left',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <th style={{ padding: '10px 8px' }}>Fecha</th>
            <th style={{ padding: '10px 8px' }}>Cliente</th>
            <th style={{ padding: '10px 8px' }}>Mesa</th>
            <th style={{ padding: '10px 8px' }}>Invitados</th>
            <th style={{ padding: '10px 8px' }}>Estado</th>
            <th style={{ padding: '10px 8px' }}>Creada</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.id}
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <td style={{ padding: '10px 8px' }}>{r.date}</td>
              <td style={{ padding: '10px 8px' }}>{r.clientName}</td>
              <td style={{ padding: '10px 8px' }}>
                {r.tableNumber} ({r.zoneName})
              </td>
              <td style={{ padding: '10px 8px' }}>{r.guestCount}</td>
              <td style={{ padding: '10px 8px' }}>
                <span
                  style={{
                    background:
                      r.status === 'Completada'
                        ? 'var(--accent)'
                        : r.status === 'Cancelada'
                          ? '#6b7280'
                          : r.status === 'Confirmada'
                            ? '#3b82f6'
                            : 'var(--warning)',
                    borderRadius: 999,
                    color: '#fff',
                    fontSize: 11,
                    padding: '2px 8px',
                  }}
                >
                  {r.status}
                </span>
              </td>
              <td style={{ padding: '10px 8px' }}>
                {new Date(r.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
