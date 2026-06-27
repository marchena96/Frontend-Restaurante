import { StatusDropdown } from './StatusDropdown'
import type { ReservationResponse } from '../types/reservation'

interface TimelineViewProps {
  reservations: readonly ReservationResponse[] | undefined
  isLoading: boolean
}

export function TimelineView({ reservations, isLoading }: TimelineViewProps) {
  if (isLoading) {
    return <p className="text-muted">Cargando reservas...</p>
  }

  if (!reservations || reservations.length === 0) {
    return <p className="text-muted">No hay reservas para hoy.</p>
  }

  return (
    <div className="timeline">
      {reservations.map((reservation) => (
        <div className="timeline-row" key={reservation.id}>
          <time>{reservation.reservationTime.slice(0, 5)}</time>
          <div>
            <strong>{reservation.clientName}</strong>
            <span>
              Mesa {reservation.tableNumber} &middot; {reservation.zoneName}{' '}
              &middot; {reservation.guestCount} pax
            </span>
          </div>
          <StatusDropdown
            reservationId={reservation.id}
            currentStatus={reservation.status}
            clientName={reservation.clientName}
          />
        </div>
      ))}
    </div>
  )
}
