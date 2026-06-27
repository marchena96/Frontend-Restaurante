import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/components/Button'
import { useCreateTurnMutation } from '../hooks/useCreateTurnMutation'
import { useUpdateTurnMutation } from '../hooks/useUpdateTurnMutation'
import type { TurnDto, TurnFormInput } from '../types/turn'

interface TurnFormModalProps {
  onClose: () => void
  editingTurn?: TurnDto
}

export function TurnFormModal({ onClose, editingTurn }: TurnFormModalProps) {
  const createMutation = useCreateTurnMutation()
  const updateMutation = useUpdateTurnMutation()
  const isEdit = !!editingTurn

  const form = useForm<TurnFormInput>({
    defaultValues: {
      name: editingTurn?.name ?? '',
      startTime: editingTurn?.startTime ?? '09:00',
      endTime: editingTurn?.endTime ?? '17:00',
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit) {
          await updateMutation.mutateAsync({ id: editingTurn!.id, payload: value })
        } else {
          await createMutation.mutateAsync(value)
        }
        onClose()
      } catch {
        // Error handled by mutation onError
      }
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="operations-panel" style={{ maxWidth: 420, width: '100%' }}>
        <div className="section-heading">
          <h2>{isEdit ? 'Editar turno' : 'Nuevo turno'}</h2>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
          className="grid"
        >
          <form.Field name="name">
            {(field) => (
              <div>
                <label className="field-label">Nombre del turno</label>
                <input
                  className="button button--secondary w-full"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej: Matutino"
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="startTime">
            {(field) => (
              <div>
                <label className="field-label">Hora de inicio</label>
                <input
                  type="time"
                  className="button button--secondary w-full"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="endTime">
            {(field) => (
              <div>
                <label className="field-label">Hora de fin</label>
                <input
                  type="time"
                  className="button button--secondary w-full"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          </form.Field>

          <div className="header-actions">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
