import { useState, useCallback } from 'react'
import { useClientSearchQuery } from '../hooks/useClientSearchQuery'
import type { Client } from '../types/client'

interface ClientSearchProps {
  onSelect: (client: Client) => void
  placeholder?: string
}

export function ClientSearch({ onSelect, placeholder }: ClientSearchProps) {
  const [query, setQuery] = useState('')
  const { data: results, isLoading } = useClientSearchQuery(query)

  const handleSelect = useCallback(
    (client: Client) => {
      onSelect(client)
      setQuery('')
    },
    [onSelect],
  )

  return (
    <div className="relative">
      <input
        className="button button--secondary w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? 'Buscar comensal...'}
      />
      {query.length >= 2 && (
        <div className="search-dropdown">
          {isLoading && (
            <p className="text-muted" style={{ padding: 12 }}>Buscando...</p>
          )}
          {results && results.length === 0 && (
            <p className="text-muted" style={{ padding: 12 }}>
              Sin resultados
            </p>
          )}
          {results?.map((client) => (
            <button
              key={client.id}
              type="button"
              className="search-result-item"
              onClick={() => handleSelect(client)}
            >
              <strong>{`${client.firstName} ${client.lastName}`}</strong>
              <small className="text-muted" style={{ display: 'block' }}>
                {client.phoneNumber}
              </small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
