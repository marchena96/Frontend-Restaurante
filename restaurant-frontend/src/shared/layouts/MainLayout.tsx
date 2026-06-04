import { Link, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { RestaurantModule } from '../types'

interface MainLayoutProps {
  children: ReactNode
}

const navigationItems: readonly {
  id: RestaurantModule
  label: string
  metric: string
  to: string
}[] = [
  { id: 'dashboard', label: 'Dashboard', metric: 'Hoy', to: '/' },
  { id: 'clients', label: 'Comensales', metric: '128', to: '/clients' },
  {
    id: 'infrastructure',
    label: 'Salon',
    metric: '24 mesas',
    to: '/infrastructure',
  },
  { id: 'reservations', label: 'Reservas', metric: '36', to: '/reservations' },
  { id: 'waiting-list', label: 'Espera', metric: '9', to: '/waiting-list' },
]

function getActiveModule(pathname: string): RestaurantModule {
  if (pathname.startsWith('/clients')) {
    return 'clients'
  }

  if (pathname.startsWith('/infrastructure')) {
    return 'infrastructure'
  }

  if (pathname.startsWith('/reservations')) {
    return 'reservations'
  }

  if (pathname.startsWith('/waiting-list')) {
    return 'waiting-list'
  }

  return 'dashboard'
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const activeModule = getActiveModule(pathname)

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="brand">
          <span className="brand-mark">RE</span>
          <div>
            <strong>Restaurante Enterprise</strong>
            <span>Operacion de sala</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              aria-current={item.id === activeModule ? 'page' : undefined}
              className="nav-item"
              key={item.id}
              to={item.to}
            >
              <span>{item.label}</span>
              <small>{item.metric}</small>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-panel">{children}</main>
    </div>
  )
}
