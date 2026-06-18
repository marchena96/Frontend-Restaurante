import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { navItems, getActiveModule } from '../config/navigation'
import { useSidebarMetrics } from '../hooks/useSidebarMetrics'

export function AdminLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const activeModule = getActiveModule(pathname)
  const metrics = useSidebarMetrics()

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
          {navItems.map((item) => (
            <Link
              aria-current={item.id === activeModule ? 'page' : undefined}
              className="nav-item"
              key={item.id}
              to={item.to}
            >
              <span>{item.label}</span>
              <small>{metrics[item.id]}</small>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  )
}
