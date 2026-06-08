import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/components/Button'
import { ClientSearch } from '../../clients/ui/ClientSearch'
import { useAddToQueueMutation } from '../hooks/useAddToQueueMutation'
import type { AddToQueuePayload } from '../api/waitingListApi'
import type { Client } from '../../clients/types/client'

interface AddToQueueModalProps {
  onClose: () => void
}

export function AddToQueueModal({ onClose }: AddToQueueModalProps) {
  const addMutation = useAddToQueueMutation()
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const form = useForm<{ partySize: number }>({
    defaultValues: {
      partySize: 2,
    },
    onSubmit: async ({ value }) => {
      if (!selectedClient) return
      const now = new Date()
      const today = now.toISOString().slice(0, 10)
      const startTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const endHour = now.getHours() + 2
      const endTime = `${String(endHour).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const payload: AddToQueuePayload = {
        clientId: selectedClient.id,
        partySize: value.partySize,
        date: today,
        startTime,
        endTime,
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
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Cliente
            </label>
            {selectedClient ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--panel-muted)',
                  borderRadius: 8,
                }}
              >
                <span>
                  <strong>{`${selectedClient.firstName} ${selectedClient.lastName}`}</strong>
                  <small style={{ display: 'block', color: 'var(--text-muted)' }}>
                    {selectedClient.phoneNumber}
                  </small>
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedClient(null)}
                >
                  Cambiar
                </Button>
              </div>
            ) : (
              <ClientSearch
                onSelect={(client: Client) => setSelectedClient(client)}
                placeholder="Buscar cliente por nombre..."
              />
            )}
          </div>

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

          <div className="header-actions">
            <Button
              type="submit"
              disabled={addMutation.isPending || !selectedClient}
            >
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
