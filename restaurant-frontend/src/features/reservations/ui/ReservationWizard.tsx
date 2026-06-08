import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/components/Button'
import { ClientSearch } from '../../clients/ui/ClientSearch'
import { InteractiveFloorPlan } from '../../infrastructure/ui/InteractiveFloorPlan'
import { useCreateReservationMutation } from '../hooks/useCreateReservationMutation'
import type { ReservationCreateInput } from '../types/reservation'
import type { Client } from '../../clients/types/client'
import type { RestaurantTable } from '../../infrastructure/types/table'

type Step = 'client' | 'table' | 'details' | 'confirm'

export function ReservationWizard() {
  const [step, setStep] = useState<Step>('client')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(
    null,
  )

  const createReservation = useCreateReservationMutation()

  const form = useForm<ReservationCreateInput>({
    defaultValues: {
      clientId: 0,
      tableId: 0,
      date: '',
      reservationTime: '',
      guestCount: 1,
    },
    onSubmit: async ({ value }) => {
      await createReservation.mutateAsync(value)
      setStep('confirm')
    },
  })

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client)
    form.setFieldValue('clientId', client.id)
    setStep('table')
  }

  const handleSelectTable = (table: RestaurantTable) => {
    setSelectedTable(table)
    form.setFieldValue('tableId', table.id)
    form.setFieldValue('guestCount', table.capacity)
    setStep('details')
  }

  return (
    <div className="operations-panel" style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 20 }}>
        <div className="section-heading">
          <h2>Nueva reserva</h2>
          <small style={{ color: 'var(--text-muted)' }}>
            Paso {['client', 'table', 'details', 'confirm'].indexOf(step) + 1} de 4
          </small>
        </div>
      </div>

      {step === 'client' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <p>
            <strong>Seleccionar comensal</strong>
          </p>
          <ClientSearch
            onSelect={handleSelectClient}
            placeholder="Buscar comensal por nombre o telefono..."
          />
        </div>
      )}

      {step === 'table' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <p>
            <strong>Seleccionar mesa</strong>
          </p>
          <InteractiveFloorPlan
            onSelectTable={handleSelectTable}
            selectedTableId={selectedTable?.id ?? null}
            showTitle={false}
          />
          <Button variant="secondary" onClick={() => setStep('client')}>
            Volver
          </Button>
        </div>
      )}

      {step === 'details' && (
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
              Comensal
            </label>
            <p>{`${selectedClient?.firstName} ${selectedClient?.lastName}`}</p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Mesa
            </label>
            <p>
              Mesa {selectedTable?.tableNumber} &middot;{' '}
              {selectedTable?.zoneName} &middot; {selectedTable?.capacity} pax
            </p>
          </div>

          <form.Field name="date">
            {(field) => (
              <div>
                <label
                  style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}
                >
                  Fecha
                </label>
                <input
                  className="button button--secondary"
                  style={{ width: '100%' }}
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="reservationTime">
            {(field) => (
              <div>
                <label
                  style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}
                >
                  Hora
                </label>
                <input
                  className="button button--secondary"
                  style={{ width: '100%' }}
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="guestCount">
            {(field) => (
              <div>
                <label
                  style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}
                >
                  Cantidad de invitados
                </label>
                <input
                  className="button button--secondary"
                  style={{ width: '100%' }}
                  type="number"
                  min={1}
                  max={selectedTable?.capacity ?? 20}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value))
                  }
                />
              </div>
            )}
          </form.Field>

          <div className="header-actions">
            <Button type="submit" disabled={createReservation.isPending}>
              {createReservation.isPending
                ? 'Creando...'
                : 'Confirmar reserva'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep('table')}
            >
              Volver
            </Button>
          </div>
        </form>
      )}

      {step === 'confirm' && (
        <div style={{ display: 'grid', gap: 16, textAlign: 'center' }}>
          <p>
            <strong>Reserva creada exitosamente</strong>
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            {`${selectedClient?.firstName} ${selectedClient?.lastName}`} &middot; Mesa {selectedTable?.tableNumber}{' '}
            &middot; {form.state.values.date} a las{' '}
            {form.state.values.reservationTime}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedClient(null)
              setSelectedTable(null)
              form.reset()
              setStep('client')
            }}
          >
            Nueva reserva
          </Button>
        </div>
      )}
    </div>
  )
}
