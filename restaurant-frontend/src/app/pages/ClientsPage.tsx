import { useState } from 'react'
import { useClientsQuery } from '../../features/clients/hooks/useClientsQuery'
import { useCreateClientMutation } from '../../features/clients/hooks/useCreateClientMutation'
import { ClientsTable } from '../../features/clients/ui/ClientsTable'
import { ClientRegisterForm } from '../../features/clients/ui/ClientRegisterForm'
import { Button } from '../../shared/components/Button'

export function ClientsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: clients, isLoading } = useClientsQuery()
  const createMutation = useCreateClientMutation()

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Comensales</p>
          <h1>Gestion de comensales</h1>
        </div>
        <div className="header-actions">
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Ver listado' : 'Nuevo comensal'}
          </Button>
        </div>
      </header>

      {showForm ? (
        <ClientRegisterForm
          onSubmit={(values) => {
            createMutation.mutate(values, {
              onSuccess: () => setShowForm(false),
            })
          }}
          onCancel={() => setShowForm(false)}
          isSubmitting={createMutation.isPending}
        />
      ) : (
        <ClientsTable clients={clients} isLoading={isLoading} />
      )}
    </>
  )
}
