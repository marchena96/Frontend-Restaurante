import { useState, useMemo } from 'react'
import { useLocalLayoutQuery } from '../hooks/useLocalLayoutQuery'
import { TableCard } from './TableCard'
import { ZoneSelector } from './ZoneSelector'
import { groupTablesByZone } from '../services/layoutCalculator'
import type { RestaurantTable } from '../types/table'

interface InteractiveFloorPlanProps {
  onSelectTable?: (table: RestaurantTable) => void
  selectedTableId?: number | null
  showTitle?: boolean
}

export function InteractiveFloorPlan({
  onSelectTable,
  selectedTableId,
  showTitle = true,
}: InteractiveFloorPlanProps) {
  const { data, isLoading, isError, error } = useLocalLayoutQuery()
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const grouped = useMemo(
    () =>
      data?.tables
        ? groupTablesByZone(data.tables, selectedZone)
        : undefined,
    [data, selectedZone],
  )

  if (isLoading) {
    return <p className="text-muted">Cargando plano del salon...</p>
  }

  if (isError) {
    return (
      <div className="error-banner">
        <p>Error al cargar el plano: {error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    )
  }

  if (!data) {
    return <p className="text-muted">No se pudo cargar el plano.</p>
  }

  return (
    <section>
      {showTitle && (
        <div className="section-heading">
          <h2>Plano del salon</h2>
        </div>
      )}
      <ZoneSelector
        zones={data.zones}
        selectedZone={selectedZone}
        onSelect={setSelectedZone}
      />
      <div className="grid" style={{ gap: 24, marginTop: 20 }}>
        {grouped &&
          Object.entries(grouped).map(([zone, tables]) => (
            <div key={zone}>
              <h3 style={{ marginBottom: 12 }}>{zone}</h3>
              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                }}
              >
                {tables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onSelect={onSelectTable}
                    selected={selectedTableId === table.id}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
