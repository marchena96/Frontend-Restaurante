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
      className="modal-overlay"
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

        <div className="mb-16">
          <p>
            <strong>{entry.clientName}</strong> &middot; {entry.partySize} pax
          </p>
          {entry.preferredZone && (
            <small className="text-muted">
              Prefiere: {entry.preferredZone}
            </small>
          )}
        </div>

        {isLoading && <p className="text-muted">Buscando mesas disponibles...</p>}

        {bestMatch && !selectedTableId && (
          <div className="best-match-card">
            <small className="text-muted">
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
          <div className="available-tables-grid">
            {availableTables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => setSelectedTableId(table.id)}
                className={
                  selectedTableId === table.id
                    ? 'table-option-btn table-option-btn--selected'
                    : 'table-option-btn'
                }
              >
                <strong>Mesa {table.tableNumber}</strong>
                <small
                  className={
                    selectedTableId === table.id ? 'fs-13 block' : 'text-muted block fs-13'
                  }
                  style={{
                    color:
                      selectedTableId === table.id
                        ? 'rgba(255,255,255,0.7)'
                        : undefined,
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
