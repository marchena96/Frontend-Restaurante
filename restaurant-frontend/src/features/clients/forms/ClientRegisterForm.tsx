import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/components/Button'
import type { Client } from '../types/client'
import { clientFormSchema, type ClientFormValues } from './clientFormSchema'

interface ClientRegisterFormProps {
  initialValues?: Partial<ClientFormValues>
  onSubmit: (values: Omit<Client, 'id'>) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function ClientRegisterForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: ClientRegisterFormProps) {
  const form = useForm<ClientFormValues>({
    defaultValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
      idCard: initialValues?.idCard ?? '',
    },
    onSubmit: async ({ value }) => {
      const parsed = clientFormSchema.parse(value)
      onSubmit({
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        phoneNumber: parsed.phoneNumber,
        idCard: parsed.idCard,
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="grid"
      style={{ maxWidth: 400 }}
    >
      <form.Field name="firstName">
        {(field) => (
          <div>
            <label className="field-label" htmlFor="client-first-name">Nombre</label>
            <input
              id="client-first-name"
              className="button button--secondary w-full"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: Juan"
            />
            {field.state.meta.errors?.length > 0 && (
              <small className="text-warning" role="alert">
                {field.state.meta.errors.join(', ')}
              </small>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="lastName">
        {(field) => (
          <div>
            <label className="field-label" htmlFor="client-last-name">Apellido</label>
            <input
              id="client-last-name"
              className="button button--secondary w-full"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: Perez"
            />
            {field.state.meta.errors?.length > 0 && (
              <small className="text-warning" role="alert">
                {field.state.meta.errors.join(', ')}
              </small>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="phoneNumber">
        {(field) => (
          <div>
            <label className="field-label" htmlFor="client-phone">Telefono</label>
            <input
              id="client-phone"
              className="button button--secondary w-full"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: 8888-5555"
            />
            {field.state.meta.errors?.length > 0 && (
              <small className="text-warning" role="alert">
                {field.state.meta.errors.join(', ')}
              </small>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="idCard">
        {(field) => (
          <div>
            <label className="field-label" htmlFor="client-id-card">Cedula</label>
            <input
              id="client-id-card"
              className="button button--secondary w-full"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: 504580546"
            />
            {field.state.meta.errors?.length > 0 && (
              <small className="text-warning" role="alert">
                {field.state.meta.errors.join(', ')}
              </small>
            )}
          </div>
        )}
      </form.Field>

      <div className="header-actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
