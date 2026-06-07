import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '../../../shared/components/Button'
import type { CreateClientPayload } from '../api/clientApi'

const clientFormSchema = z.object({
  fullName: z.string().min(1, 'El nombre es obligatorio'),
  phoneNumber: z.string().min(8, 'Telefono invalido'),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientRegisterFormProps {
  initialValues?: Partial<ClientFormValues>
  onSubmit: (values: CreateClientPayload) => void
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
      fullName: initialValues?.fullName ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
      email: initialValues?.email ?? '',
    },
    onSubmit: async ({ value }) => {
      const parsed = clientFormSchema.parse(value)
      onSubmit({
        fullName: parsed.fullName,
        phoneNumber: parsed.phoneNumber,
        email: parsed.email || undefined,
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
      <form.Field name="fullName">
        {(field) => (
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Nombre completo
            </label>
            <input
              className="button button--secondary"
              style={{ width: '100%' }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: Juan Perez"
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

      <form.Field name="email">
        {(field) => (
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Email (opcional)
            </label>
            <input
              className="button button--secondary"
              style={{ width: '100%' }}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej: juan@ejemplo.com"
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
