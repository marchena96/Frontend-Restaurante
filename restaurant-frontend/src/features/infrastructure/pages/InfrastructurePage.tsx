import { InteractiveFloorPlan } from '../components/InteractiveFloorPlan'

export function InfrastructurePage() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Salon</p>
          <h1>Infraestructura del local</h1>
        </div>
      </header>

      <InteractiveFloorPlan />
    </>
  )
}
