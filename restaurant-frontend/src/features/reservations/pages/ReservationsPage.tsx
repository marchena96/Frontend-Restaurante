import { useState } from 'react'
import { useReservationsQuery } from '../hooks/useReservationsQuery'
import { ReservationWizard } from '../forms/ReservationWizard'
import { TimelineView } from '../components/TimelineView'
import { HistoryLog } from '../components/HistoryLog'
import { ClientSearch } from '../../clients/components/ClientSearch'
import { InteractiveFloorPlan } from '../../infrastructure/components/InteractiveFloorPlan'
import { Button } from '../../../shared/components/Button'

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

      {showWizard && (
        <ReservationWizard
          renderClientSearch={(props) => <ClientSearch {...props} />}
          renderFloorPlan={(props) => <InteractiveFloorPlan {...props} />}
        />
      )}

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
