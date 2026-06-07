import { useReservationsQuery } from '../../features/reservations/hooks/useReservationsQuery'
import { ReservationWizard } from '../../features/reservations/ui/ReservationWizard'
import { TimelineView } from '../../features/reservations/ui/TimelineView'
import { HistoryLog } from '../../features/reservations/ui/HistoryLog'
import { Button } from '../../shared/components/Button'
import { useState } from 'react'

export function ReservationsPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { data: reservations, isLoading } = useReservationsQuery()

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Reservas</p>
          <h1>Reservaciones</h1>
        </div>
        <div className="header-actions">
          <Button
            variant={showHistory ? 'secondary' : 'ghost'}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Agenda' : 'Historial'}
          </Button>
          <Button onClick={() => setShowWizard(!showWizard)}>
            {showWizard ? 'Cerrar' : 'Crear reserva'}
          </Button>
        </div>
      </header>

      {showWizard && <ReservationWizard />}

      {showHistory ? (
        <HistoryLog reservations={reservations} isLoading={isLoading} />
      ) : (
        <section className="operations-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Reservas</p>
              <h2>Proximos bloques</h2>
            </div>
          </div>
          <TimelineView reservations={reservations} isLoading={isLoading} />
        </section>
      )}
    </>
  )
}
