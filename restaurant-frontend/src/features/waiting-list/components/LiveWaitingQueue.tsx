import { useState } from 'react'
import { useWaitingListQuery } from '../hooks/useWaitingListQuery'
import { useRemoveFromQueueMutation } from '../hooks/useRemoveFromQueueMutation'
import { sortByArrival, getWaitingTimeMinutes, formatWaitingTime, getQueueSummary } from '../services/queuePrioritizer'
import { AssignTableModal } from '../forms/AssignTableModal'
import { Button } from '../../../shared/components/Button'
import type { WaitingListEntry } from '../types/waitingListEntry'

interface LiveWaitingQueueProps {
  onOpenAddModal: () => void
}

export function LiveWaitingQueue({ onOpenAddModal }: LiveWaitingQueueProps) {
  const { data: entries, isLoading } = useWaitingListQuery()
  const removeMutation = useRemoveFromQueueMutation()
  const [assigningEntry, setAssigningEntry] =
    useState<WaitingListEntry | null>(null)

  const sorted = sortByArrival(
    (entries ?? []).filter((e) => e.status === 'EnEspera'),
  )

  const removed = (entries ?? []).filter((e) => e.status !== 'EnEspera')

  const summary = getQueueSummary(entries ?? [])

  return (
    <>
      <section className="metrics-grid" aria-label="Resumen de cola">
        <article className="metric-card">
          <span>En espera</span>
          <strong>{summary.total}</strong>
          <small>Tiempo promedio: {formatWaitingTime(summary.avgWaitMinutes)}</small>
        </article>
        <article className="metric-card">
          <span>Grupos pequenos</span>
          <strong>{summary.byPartySize[1] ?? 0 + (summary.byPartySize[2] ?? 0)}</strong>
          <small>1-2 personas</small>
        </article>
        <article className="metric-card">
          <span>Grupos medianos</span>
          <strong>{summary.byPartySize[3] ?? 0 + (summary.byPartySize[4] ?? 0)}</strong>
          <small>3-4 personas</small>
        </article>
        <article className="metric-card">
          <span>Grupos grandes</span>
          <strong>{(summary.byPartySize[5] ?? 0) + (summary.byPartySize[6] ?? 0)}</strong>
          <small>5+ personas</small>
        </article>
      </section>

      <section className="operations-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Walk-ins</p>
            <h2>Cola de espera</h2>
          </div>
          <Button onClick={onOpenAddModal}>Agregar grupo</Button>
        </div>

        {isLoading && <p className="text-muted">Cargando cola de espera...</p>}

        {!isLoading && sorted.length === 0 && (
          <p className="text-muted">No hay grupos en espera.</p>
        )}

        {sorted.length > 0 && (
          <div className="grid-sm">
            {sorted.map((entry, index) => {
              const waitMinutes = getWaitingTimeMinutes(entry)
              const isUrgent = waitMinutes >= 20

              return (
                <div
                  key={entry.id}
                  className={
                    isUrgent
                      ? 'queue-entry-card queue-entry-card--urgent'
                      : 'queue-entry-card'
                  }
                >
                  <strong className="text-muted">
                    #{index + 1}
                  </strong>
                  <div>
                    <strong>{entry.clientName}</strong>
                    <span className="text-muted block fs-13">
                      {entry.partySize} pax
                      {entry.preferredZone ? ` · ${entry.preferredZone}` : ''}
                    </span>
                  </div>
                  <time
                    style={{
                      color: isUrgent ? 'var(--warning)' : 'var(--text-muted)',
                      fontWeight: isUrgent ? 800 : 400,
                      fontSize: 13,
                    }}
                  >
                    {formatWaitingTime(waitMinutes)}
                  </time>
                  <div className="header-actions">
                    <Button
                      variant="secondary"
                      onClick={() => setAssigningEntry(entry)}
                    >
                      Asignar
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => removeMutation.mutate(entry.id)}
                      disabled={removeMutation.isPending}
                      style={{ color: '#6b7280' }}
                    >
                      X
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {removed.length > 0 && (
        <section className="operations-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Historial</p>
              <h2>Asignaciones recientes</h2>
            </div>
          </div>
          <div className="grid-sm">
            {removed.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="history-entry-card"
              >
                <div>
                  <strong>{entry.clientName}</strong>
                  <span className="text-muted block fs-13">
                    {entry.partySize} pax ·{' '}
                    <span
                      style={{
                        color:
                          entry.status === 'Asignado'
                            ? 'var(--accent)'
                            : '#6b7280',
                      }}
                    >
                      {entry.status === 'Asignado' ? 'Asignado' : 'Cancelado'}
                    </span>
                  </span>
                </div>
                <small className="text-muted">
                  {formatWaitingTime(getWaitingTimeMinutes(entry))}
                </small>
              </div>
            ))}
          </div>
        </section>
      )}

      {assigningEntry && (
        <AssignTableModal
          entry={assigningEntry}
          onClose={() => setAssigningEntry(null)}
        />
      )}
    </>
  )
}
