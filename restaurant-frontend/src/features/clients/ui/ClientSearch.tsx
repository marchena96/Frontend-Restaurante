import { useState, useCallback } from 'react'
import { useClientSearchQuery } from '../hooks/useClientSearchQuery'
import type { ClientResponse } from '../types/client'

interface ClientSearchProps {
  onSelect: (client: ClientResponse) => void
  placeholder?: string
}

export function ClientSearch({ onSelect, placeholder }: ClientSearchProps) {
  const [query, setQuery] = useState('')
  const { data: results, isLoading } = useClientSearchQuery(query)

  const handleSelect = useCallback(
    (client: ClientResponse) => {
      onSelect(client)
      setQuery('')
    },
    [onSelect],
  )

  return (
    <div style={{ position: 'relative' }}>
      <input
        className="button button--secondary"
        style={{ width: '100%' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? 'Buscar comensal...'}
      />
      {query.length >= 2 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            zIndex: 10,
            marginTop: 4,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {isLoading && (
            <p style={{ padding: 12, color: 'var(--text-muted)' }}>Buscando...</p>
          )}
          {results && results.length === 0 && (
            <p style={{ padding: 12, color: 'var(--text-muted)' }}>
              Sin resultados
            </p>
          )}
          {results?.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => handleSelect(client)}
              style={{
                display: 'block',
                width: '100%',
                padding: 10,
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              <strong>{client.fullName}</strong>
              <small style={{ display: 'block', color: 'var(--text-muted)' }}>
                {client.phoneNumber}
              </small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
