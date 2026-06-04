import { Button } from '../../shared/components/Button'

export function DashboardPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Turno de cena</p>
          <h1>Panel operativo</h1>
        </div>
        <div className="header-actions">
          <Button variant="secondary">Nueva reserva</Button>
          <Button>Registrar llegada</Button>
        </div>
      </header>

      <section className="metrics-grid" aria-label="Indicadores del dia">
        <article className="metric-card">
          <span>Reservas activas</span>
          <strong>36</strong>
          <small>12 pendientes de confirmacion</small>
        </article>
        <article className="metric-card">
          <span>Mesas disponibles</span>
          <strong>14</strong>
          <small>6 listas para grupos grandes</small>
        </article>
        <article className="metric-card">
          <span>Lista de espera</span>
          <strong>9</strong>
          <small>18 min promedio de espera</small>
        </article>
        <article className="metric-card">
          <span>Ocupacion</span>
          <strong>71%</strong>
          <small>Pico estimado 7:30 p.m.</small>
        </article>
      </section>

      <section className="workspace-grid">
        <article className="operations-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Salon</p>
              <h2>Estado de zonas</h2>
            </div>
            <Button variant="ghost">Ver plano</Button>
          </div>

          <div className="zone-list">
            {[
              ['Terraza', '8 mesas', '62'],
              ['Principal', '12 mesas', '83'],
              ['Privado', '4 mesas', '50'],
            ].map(([zone, tables, occupancy]) => (
              <div className="zone-row" key={zone}>
                <div>
                  <strong>{zone}</strong>
                  <span>{tables}</span>
                </div>
                <progress max="100" value={occupancy} />
                <small>{occupancy}%</small>
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
            <Button variant="ghost">Agenda</Button>
          </div>

          <div className="timeline">
            {[
              ['6:00 p.m.', 'Lopez', 'Mesa 12', 'Confirmada'],
              ['6:30 p.m.', 'Vargas', 'Mesa 4', 'Pendiente'],
              ['7:00 p.m.', 'Mora', 'Mesa 18', 'Confirmada'],
            ].map(([time, client, table, status]) => (
              <div className="timeline-row" key={`${time}-${client}`}>
                <time>{time}</time>
                <div>
                  <strong>{client}</strong>
                  <span>{table}</span>
                </div>
                <small>{status}</small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
