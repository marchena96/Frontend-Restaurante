import { useState } from 'react'
import { LiveWaitingQueue } from '../components/LiveWaitingQueue'
import { AddToQueueModal } from '../forms/AddToQueueModal'
import { ClientSearch } from '@/features/clients/components/ClientSearch'

export function WaitingListPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Espera</p>
          <h1>Lista de espera</h1>
        </div>
      </header>

      <LiveWaitingQueue onOpenAddModal={() => setShowAddModal(true)} />

      {showAddModal && (
        <AddToQueueModal
          onClose={() => setShowAddModal(false)}
          renderClientSearch={(props) => <ClientSearch {...props} />}
        />
      )}
    </>
  )
}
