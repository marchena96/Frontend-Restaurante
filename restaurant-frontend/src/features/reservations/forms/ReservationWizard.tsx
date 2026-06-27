import { useState, type ReactNode } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/components/Button'
import { useCreateReservationMutation } from '../hooks/useCreateReservationMutation'
import type { ReservationCreateInput } from './reservationSchema'
import type { Client } from '@/features/clients/types/client'
import type { RestaurantTable } from '@/features/infrastructure/types/table'

type Step = 'client' | 'table' | 'details' | 'confirm'

interface ReservationWizardProps {
  renderClientSearch: (props: {
    onSelect: (client: Client) => void
    placeholder?: string
  }) => ReactNode
  renderFloorPlan: (props: {
    onSelectTable: (table: RestaurantTable) => void
    selectedTableId: number | null
    showTitle: boolean
  }) => ReactNode
}

export function ReservationWizard({
  renderClientSearch,
  renderFloorPlan,
}: ReservationWizardProps) {
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
      try {
        await createReservation.mutateAsync(value)
        setStep('confirm')
      } catch {
        // Error handled by mutation onError
      }
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
      <div className="mb-20">
        <div className="section-heading">
          <h2>Nueva reserva</h2>
          <small className="text-muted">
            Paso {['client', 'table', 'details', 'confirm'].indexOf(step) + 1} de 4
          </small>
        </div>
      </div>

      {step === 'client' && (
        <div className="grid">
          <p>
            <strong>Seleccionar comensal</strong>
          </p>
          {renderClientSearch({
            onSelect: handleSelectClient,
            placeholder: 'Buscar comensal por nombre o telefono...',
          })}
        </div>
      )}

      {step === 'table' && (
        <div className="grid">
          <p>
            <strong>Seleccionar mesa</strong>
          </p>
          {renderFloorPlan({
            onSelectTable: handleSelectTable,
            selectedTableId: selectedTable?.id ?? null,
            showTitle: false,
          })}
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
          className="grid"
        >
          <div>
            <label className="field-label" htmlFor="res-client">Comensal</label>
            <p id="res-client">{`${selectedClient?.firstName} ${selectedClient?.lastName}`}</p>
          </div>

          <div>
            <label className="field-label" htmlFor="res-table">Mesa</label>
            <p id="res-table">
              Mesa {selectedTable?.tableNumber} &middot;{' '}
              {selectedTable?.zoneName} &middot; {selectedTable?.capacity} pax
            </p>
          </div>

          <form.Field name="date">
            {(field) => (
              <div>
                <label className="field-label" htmlFor="res-date">Fecha</label>
                <input
                  id="res-date"
                  className="button button--secondary w-full"
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
                <label className="field-label" htmlFor="res-time">Hora</label>
                <input
                  id="res-time"
                  className="button button--secondary w-full"
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
                <label className="field-label" htmlFor="res-guests">Cantidad de invitados</label>
                <input
                  id="res-guests"
                  className="button button--secondary w-full"
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
        <div className="grid text-center">
          <p>
            <strong>Reserva creada exitosamente</strong>
          </p>
          <p className="text-muted">
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
