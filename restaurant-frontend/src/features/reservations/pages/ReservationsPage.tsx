import { useState } from 'react'
import { useReservationsQuery } from '../hooks/useReservationsQuery'
import { ReservationWizard } from '../forms/ReservationWizard'
import { TimelineView } from '../components/TimelineView'
import { HistoryLog } from '../components/HistoryLog'
import { ClientSearch } from '@/features/clients/components/ClientSearch'
import { InteractiveFloorPlan } from '@/features/infrastructure/components/InteractiveFloorPlan'
import { Button } from '@/shared/components/Button'

export function ReservationsPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { data: reservations, isLoading, isError } = useReservationsQuery()

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

      {isError && (
        <section className="error-banner" role="alert">
          No se pudieron cargar las reservas. Intente recargar la pagina.
        </section>
      )}

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
