import type { ZoneSummary } from '../api/infrastructureApi'

interface ZoneSelectorProps {
  zones: readonly ZoneSummary[] | undefined
  selectedZone: string | null
  onSelect: (zoneName: string | null) => void
}

export function ZoneSelector({
  zones,
  selectedZone,
  onSelect,
}: ZoneSelectorProps) {
  if (!zones || zones.length === 0) return null

  return (
    <div className="header-actions" role="group" aria-label="Filtrar por zona">
      <button
        type="button"
        className={selectedZone === null ? 'button button--primary' : 'button button--secondary'}
        onClick={() => onSelect(null)}
      >
        Todas
      </button>
      {zones.map((zone) => (
        <button
          key={zone.id}
          type="button"
          className={
            selectedZone === zone.name
              ? 'button button--primary'
              : 'button button--secondary'
          }
          onClick={() => onSelect(zone.name)}
        >
          {zone.name}
        </button>
      ))}
    </div>
  )
}
