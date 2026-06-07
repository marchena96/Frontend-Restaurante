import type { RestaurantTable, TableStatus } from '../types/table'

const statusColors: Record<TableStatus, string> = {
  Libre: '#1f7a5d',
  Ocupada: '#b7791f',
  Reservada: '#3b82f6',
  Bloqueada: '#6b7280',
}

interface TableCardProps {
  table: RestaurantTable
  onSelect?: (table: RestaurantTable) => void
  selected?: boolean
}

export function TableCard({ table, onSelect, selected }: TableCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(table)}
      style={{
        background: selected ? 'var(--accent)' : 'var(--panel)',
        border: `2px solid ${selected ? 'var(--accent-strong)' : 'var(--border)'}`,
        borderRadius: 8,
        color: selected ? '#fff' : 'var(--text)',
        cursor: onSelect ? 'pointer' : 'default',
        padding: 12,
        textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <strong>Mesa {table.tableNumber}</strong>
        <span
          style={{
            background: statusColors[table.status],
            borderRadius: 999,
            color: '#fff',
            fontSize: 11,
            padding: '2px 8px',
          }}
        >
          {table.status}
        </span>
      </div>
      <small style={{ color: selected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
        {table.zoneName} &middot; {table.capacity} pax
      </small>
    </button>
  )
}
