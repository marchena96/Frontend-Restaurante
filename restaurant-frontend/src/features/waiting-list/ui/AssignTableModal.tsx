import { useState, useMemo } from 'react'
import { Button } from '../../../shared/components/Button'
import { useAvailableTablesQuery } from '../../infrastructure/hooks/useAvailableTablesQuery'
import { useAssignTableMutation } from '../hooks/useAssignTableMutation'
import { findBestTableMatch } from '../services/queuePrioritizer'
import type { WaitingListEntry } from '../types/waitingListEntry'

interface AssignTableModalProps {
  entry: WaitingListEntry
  onClose: () => void
}

export function AssignTableModal({ entry, onClose }: AssignTableModalProps) {
  const today = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)

  const { data: availableTables, isLoading } = useAvailableTablesQuery(
    entry.partySize,
    today,
    time,
  )

  const assignMutation = useAssignTableMutation()

  const bestMatch = useMemo(
    () =>
      availableTables
        ? findBestTableMatch(entry, availableTables)
        : undefined,
    [availableTables, entry],
  )

  const handleAssign = async () => {
    if (!selectedTableId) return
    await assignMutation.mutateAsync({
      entryId: entry.id,
      tableId: selectedTableId,
    })
    onClose()
  }

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.3)',
        inset: 0,
        position: 'fixed',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="operations-panel"
        style={{ maxWidth: 480, width: '100%' }}
      >
        <div className="section-heading">
          <h2>Asignar mesa</h2>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p>
            <strong>{entry.clientName}</strong> &middot; {entry.partySize} pax
          </p>
          {entry.preferredZone && (
            <small style={{ color: 'var(--text-muted)' }}>
              Prefiere: {entry.preferredZone}
            </small>
          )}
        </div>

        {isLoading && <p className="text-muted">Buscando mesas disponibles...</p>}

        {bestMatch && !selectedTableId && (
          <div
            style={{
              background: 'var(--panel-muted)',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <small style={{ color: 'var(--text-muted)' }}>
              Mejor opcion disponible
            </small>
            <p>
              <strong>
                Mesa {bestMatch.tableNumber} &middot; {bestMatch.zoneName}{' '}
                &middot; {bestMatch.capacity} pax
              </strong>
            </p>
            <Button
              onClick={() => setSelectedTableId(bestMatch.id)}
              variant="secondary"
            >
              Seleccionar esta mesa
            </Button>
          </div>
        )}

        {availableTables && availableTables.length > 0 && (
          <div
            style={{
              display: 'grid',
              gap: 8,
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              marginBottom: 16,
            }}
          >
            {availableTables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => setSelectedTableId(table.id)}
                style={{
                  background:
                    selectedTableId === table.id
                      ? 'var(--accent)'
                      : 'var(--panel-muted)',
                  border: `2px solid ${selectedTableId === table.id ? 'var(--accent-strong)' : 'var(--border)'}`,
                  borderRadius: 8,
                  color: selectedTableId === table.id ? '#fff' : 'var(--text)',
                  cursor: 'pointer',
                  padding: 10,
                  textAlign: 'center',
                }}
              >
                <strong>Mesa {table.tableNumber}</strong>
                <small
                  style={{
                    display: 'block',
                    color:
                      selectedTableId === table.id
                        ? 'rgba(255,255,255,0.7)'
                        : 'var(--text-muted)',
                  }}
                >
                  {table.zoneName} &middot; {table.capacity} pax
                </small>
              </button>
            ))}
          </div>
        )}

        {availableTables && availableTables.length === 0 && (
          <p className="text-muted">
            No hay mesas disponibles para {entry.partySize} personas en este momento.
          </p>
        )}

        <div className="header-actions">
          <Button
            onClick={handleAssign}
            disabled={!selectedTableId || assignMutation.isPending}
          >
            {assignMutation.isPending ? 'Asignando...' : 'Asignar mesa'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
