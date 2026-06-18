import { useState } from 'react'
import { useTurnsQuery } from '../hooks/useTurnsQuery'
import { useDeleteTurnMutation } from '../hooks/useDeleteTurnMutation'
import { Button } from '../../../shared/components/Button'
import { notifyConfirm } from '../../../shared/utils/toast'
import { TurnFormModal } from './TurnFormModal'
import type { TurnDto } from '../types/turn'

export function TurnList() {
  const { data: turns, isLoading, isError, error } = useTurnsQuery()
  const deleteMutation = useDeleteTurnMutation()
  const [showForm, setShowForm] = useState(false)
  const [editingTurn, setEditingTurn] = useState<TurnDto | undefined>(undefined)

  const handleEdit = (turn: TurnDto) => {
    setEditingTurn(turn)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingTurn(undefined)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    notifyConfirm('¿Eliminar este turno?', () => deleteMutation.mutate(id))
  }

  if (isLoading) {
    return <p className="text-muted">Cargando turnos...</p>
  }

  if (isError) {
    return (
      <div className="error-banner">
        <p>Error al cargar turnos: {error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    )
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operacion de sala</p>
          <h2>Turnos</h2>
        </div>
        <Button onClick={handleAdd}>Agregar turno</Button>
      </div>

      {!turns || turns.length === 0 ? (
        <p className="text-muted">No hay turnos registrados.</p>
      ) : (
        <div className="operations-panel overflow-x-auto">
          <table className="table-data">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turns.map((turn) => (
                <tr key={turn.id}>
                  <td><strong>{turn.name}</strong></td>
                  <td>{turn.startTime.slice(0, 5)}</td>
                  <td>{turn.endTime.slice(0, 5)}</td>
                  <td>
                    <div className="header-actions" style={{ gap: 8 }}>
                      <Button variant="secondary" onClick={() => handleEdit(turn)}>
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(turn.id)}
                        disabled={deleteMutation.isPending}
                        style={{ color: '#ef4444' }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <TurnFormModal
          onClose={() => { setShowForm(false); setEditingTurn(undefined) }}
          editingTurn={editingTurn}
        />
      )}
    </section>
  )
}
