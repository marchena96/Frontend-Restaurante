import { useNavigate } from '@tanstack/react-router'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="main-panel" style={{ placeContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: 80, color: 'var(--accent)', margin: 0 }}>404</h1>
      <p style={{ fontSize: 24, margin: '8px 0' }}>Página no encontrada</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        La página que buscas no existe o ha sido movida.
      </p>
      <div>
        <button className="button button--primary" onClick={() => navigate({ to: '/' })}>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
