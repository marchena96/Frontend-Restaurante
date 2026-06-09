import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuthSessionStore } from '../../features/auth/store/authSessionStore'


// Definimos los items con las rutas corregidas que terminamos de validar
const navigationItems = [
  { label: 'Dashboard', metric: 'Hoy', to: '/admin' },
  { label: 'Comensales', metric: '128', to: '/admin/clients' },
  { label: 'Salon', metric: '24 mesas', to: '/admin/infrastructure' },
  { label: 'Reservas', metric: '36', to: '/admin/reservations' },
  { label: 'Espera', metric: '9', to: '/admin/waiting-list' },
]


export function AdminLayout() {
const navigate = useNavigate() // 2. ESTA LÍNEA ES LA CLAVE (inicialización)

return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - El menú lateral */}
      <aside className="sidebar" style={{ width: '250px', background: '#1a1a1a', color: 'white', padding: '1rem' }}>
        <div className="brand" style={{ marginBottom: '2rem' }}>
          <strong>Restaurante Enterprise</strong>
        </div>

        <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-item"
              style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}
            >
              {item.label} <small>({item.metric})</small>
            </Link>
          ))}
        </nav>

        {/* Botón de Logout */}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button
            onClick={async () => {
              await useAuthSessionStore.getState().logout()
              navigate({ to: '/login' })
            }}
            style={{ width: '100%', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Panel - Aquí es donde aparecerán tus páginas (Clients, Infrastructure, etc) */}
      <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
