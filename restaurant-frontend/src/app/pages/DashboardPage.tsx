import { Button } from '../../shared/components/Button'
import { useDashboardQuery } from '../../features/dashboard/hooks/useDashboardQuery'
import { useNavigate } from '@tanstack/react-router'

function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = Number.parseInt(h)
  const suffix = hour >= 12 ? 'p.m.' : 'a.m.'
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${suffix}`
}

export function DashboardPage() {
  const { data, isLoading } = useDashboardQuery()
  const navigate = useNavigate()

  if (isLoading || !data) {
    return (
      <section className="metrics-grid" aria-label="Indicadores del dia">
        {Array.from({ length: 4 }).map((_, i) => (
          <article className="metric-card" key={i}>
            <span>&nbsp;</span>
            <strong>--</strong>
            <small>&nbsp;</small>
          </article>
        ))}
      </section>
    )
  }

  const { metrics, zones, upcomingBlocks } = data

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Turno de cena</p>
          <h1>Panel operativo</h1>
        </div>
        <div className="header-actions">
          <Button variant="secondary" onClick={() => navigate({ to: '/admin/reservations' })}>
            Nueva reserva
          </Button>
          <Button onClick={() => navigate({ to: '/admin/waiting-list' })}>
            Registrar llegada
          </Button>
        </div>
      </header>

      <section className="metrics-grid" aria-label="Indicadores del dia">
        <article className="metric-card">
          <span>Reservas activas</span>
          <strong>{metrics.activeReservations}</strong>
          <small>{metrics.pendingReservations} pendientes de confirmacion</small>
        </article>
        <article className="metric-card">
          <span>Mesas disponibles</span>
          <strong>{metrics.availableTables}</strong>
          <small>{metrics.largeTablesAvailable} listas para grupos grandes</small>
        </article>
        <article className="metric-card">
          <span>Lista de espera</span>
          <strong>{metrics.waitingListCount}</strong>
          <small>{metrics.averageWaitMinutes} min promedio de espera</small>
        </article>
        <article className="metric-card">
          <span>Ocupacion</span>
          <strong>{metrics.occupancyPercent}%</strong>
          <small>Basado en estado actual de mesas</small>
        </article>
      </section>

      <section className="workspace-grid">
        <article className="operations-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Salon</p>
              <h2>Estado de zonas</h2>
            </div>
            <Button variant="ghost" onClick={() => navigate({ to: '/admin/infrastructure' })}>
              Ver plano
            </Button>
          </div>

          <div className="zone-list">
            {zones.map((zone) => (
              <div className="zone-row" key={zone.id}>
                <div>
                  <strong>{zone.name}</strong>
                  <span>{zone.tableCount} mesas</span>
                </div>
                <progress max="100" value={zone.occupancyPercent} />
                <small>{zone.occupancyPercent}%</small>
              </div>
            ))}
          </div>
        </article>

        <article className="operations-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Reservas</p>
              <h2>Proximos bloques</h2>
            </div>
            <Button variant="ghost" onClick={() => navigate({ to: '/admin/reservations' })}>
              Agenda
            </Button>
          </div>

          <div className="timeline">
            {upcomingBlocks.map((block) => (
              <div className="timeline-row" key={`${block.time}-${block.clientName}`}>
                <time>{formatTime(block.time)}</time>
                <div>
                  <strong>{block.clientName}</strong>
                  <span>Mesa {block.tableNumber}</span>
                </div>
                <small>{block.status}</small>
              </div>
            ))}
            {upcomingBlocks.length === 0 && (
              <div className="timeline-row">
                <span>No hay reservas proximas</span>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  )
}
