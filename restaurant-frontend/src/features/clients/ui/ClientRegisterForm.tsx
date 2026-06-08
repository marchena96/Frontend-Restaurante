import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '../../../shared/components/Button'
import type { Client } from '../types/client'

const clientFormSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  phoneNumber: z.string().min(8, 'Telefono invalido'),
  idCard: z.string().min(1, 'La cedula es obligatoria'),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

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
      style={{ display: 'grid', gap: '16px', maxWidth: 400 }}
    >
      <form.Field name="firstName">
        {(field) => (
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Nombre
            </label>
            <input
              className="button button--secondary"
              style={{ width: '100%' }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: Juan"
            />
            {field.state.meta.errors?.length > 0 && (
              <small style={{ color: 'var(--warning)' }}>
                {field.state.meta.errors.join(', ')}
              </small>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="lastName">
        {(field) => (
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Apellido
            </label>
            <input
              className="button button--secondary"
              style={{ width: '100%' }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: Perez"
            />
            {field.state.meta.errors?.length > 0 && (
              <small style={{ color: 'var(--warning)' }}>
                {field.state.meta.errors.join(', ')}
              </small>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="phoneNumber">
        {(field) => (
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Telefono
            </label>
            <input
              className="button button--secondary"
              style={{ width: '100%' }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: 8888-5555"
            />
            {field.state.meta.errors?.length > 0 && (
              <small style={{ color: 'var(--warning)' }}>
                {field.state.meta.errors.join(', ')}
              </small>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="idCard">
        {(field) => (
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Cedula
            </label>
            <input
              className="button button--secondary"
              style={{ width: '100%' }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: 504580546"
            />
            {field.state.meta.errors?.length > 0 && (
              <small style={{ color: 'var(--warning)' }}>
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
