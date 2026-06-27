import { Button } from '@/shared/components/Button'
import { useDashboardQuery } from '../hooks/useDashboardQuery'
import { useNavigate } from '@tanstack/react-router'

function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = Number.parseInt(h)
  const suffix = hour >= 12 ? 'p.m.' : 'a.m.'
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${suffix}`
}

function MetricIcon({ type }: { type: 'reservations' | 'tables' | 'waiting' | 'occupancy' }) {
  const icons = {
    reservations: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
      </svg>
    ),
    tables: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
    waiting: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    occupancy: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  }
  return icons[type]
}

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardQuery()
  const navigate = useNavigate()

  const { metrics, zones, upcomingBlocks } = data ?? {
    metrics: { activeReservations: 0, pendingReservations: 0, availableTables: 0, largeTablesAvailable: 0, waitingListCount: 0, averageWaitMinutes: 0, occupancyPercent: 0 },
    zones: [],
    upcomingBlocks: [],
  }

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

      {isError && (
        <section className="error-banner" role="alert">
          No se pudieron cargar los indicadores. Reintentando...
        </section>
      )}

      <section className="metrics-grid" aria-label="Indicadores del dia">
        <article className="metric-card animate-fade-in-up stagger-1">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Reservas activas</span>
            <MetricIcon type="reservations" />
          </div>
          <strong>{isLoading ? '--' : metrics.activeReservations}</strong>
          <small>{isLoading ? '' : `${metrics.pendingReservations} pendientes de confirmacion`}</small>
        </article>
        <article className="metric-card animate-fade-in-up stagger-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Mesas disponibles</span>
            <MetricIcon type="tables" />
          </div>
          <strong>{isLoading ? '--' : metrics.availableTables}</strong>
          <small>{isLoading ? '' : `${metrics.largeTablesAvailable} listas para grupos grandes`}</small>
        </article>
        <article className="metric-card animate-fade-in-up stagger-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Lista de espera</span>
            <MetricIcon type="waiting" />
          </div>
          <strong>{isLoading ? '--' : metrics.waitingListCount}</strong>
          <small>{isLoading ? '' : `${metrics.averageWaitMinutes} min promedio de espera`}</small>
        </article>
        <article className="metric-card animate-fade-in-up stagger-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Ocupacion</span>
            <MetricIcon type="occupancy" />
          </div>
          <strong>{isLoading ? '--' : `${metrics.occupancyPercent}%`}</strong>
          <small>Basado en estado actual de mesas</small>
        </article>
      </section>

      {!isLoading && (
        <section className="workspace-grid">
          <article className="operations-panel animate-fade-in-up stagger-5">
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

          <article className="operations-panel animate-fade-in-up stagger-6">
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
                  <span style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-dim)', padding: '16px 0' }}>
                    No hay reservas proximas
                  </span>
                </div>
              )}
            </div>
          </article>
        </section>
      )}
    </>
  )
}
