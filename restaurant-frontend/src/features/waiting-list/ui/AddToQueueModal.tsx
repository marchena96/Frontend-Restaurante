import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/components/Button'
import { useAddToQueueMutation } from '../hooks/useAddToQueueMutation'
import type { AddToQueuePayload } from '../api/waitingListApi'

interface AddToQueueModalProps {
  onClose: () => void
}

export function AddToQueueModal({ onClose }: AddToQueueModalProps) {
  const addMutation = useAddToQueueMutation()

  const form = useForm<AddToQueuePayload>({
    defaultValues: {
      clientName: '',
      partySize: 2,
      phoneNumber: '',
      preferredZone: '',
    },
    onSubmit: async ({ value }) => {
      const payload: AddToQueuePayload = {
        clientName: value.clientName,
        partySize: value.partySize,
        phoneNumber: value.phoneNumber || undefined,
        preferredZone: value.preferredZone || undefined,
      }
      await addMutation.mutateAsync(payload)
      onClose()
    },
  })

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
        style={{ maxWidth: 420, width: '100%' }}
      >
        <div className="section-heading">
          <h2>Agregar grupo a la cola</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          style={{ display: 'grid', gap: 16 }}
        >
          <form.Field name="clientName">
            {(field) => (
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                  Nombre del cliente
                </label>
                <input
                  className="button button--secondary"
                  style={{ width: '100%' }}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej: Carlos M."
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="partySize">
            {(field) => (
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                  Cantidad de personas
                </label>
                <input
                  className="button button--secondary"
                  style={{ width: '100%' }}
                  type="number"
                  min={1}
                  max={20}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value))
                  }
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="phoneNumber">
            {(field) => (
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                  Telefono (opcional)
                </label>
                <input
                  className="button button--secondary"
                  style={{ width: '100%' }}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej: 8888-5555"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="preferredZone">
            {(field) => (
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                  Zona preferida (opcional)
                </label>
                <select
                  className="button button--secondary"
                  style={{ width: '100%' }}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Sin preferencia</option>
                  <option value="Terraza">Terraza</option>
                  <option value="Principal">Principal</option>
                  <option value="Privado">Privado</option>
                </select>
              </div>
            )}
          </form.Field>

          <div className="header-actions">
            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Agregando...' : 'Agregar a la cola'}
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
