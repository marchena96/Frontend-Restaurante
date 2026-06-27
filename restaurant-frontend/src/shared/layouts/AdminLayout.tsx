import { useState, useCallback } from 'react'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { navItems, getActiveModule } from '../config/navigation'
import { useSidebarMetrics } from '../hooks/useSidebarMetrics'
import { useAuthSessionStore } from '@/features/auth/store/authSessionStore'
import { useNavigate } from '@tanstack/react-router'

const navIcons: Record<string, string> = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  clients: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  infrastructure: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z',
  reservations: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z',
  'waiting-list': 'M15 4v7H5.17L4 12.17V4h11m1-2H3a1 1 0 0 0-1 1v14l4-4h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm5 4h-2v9H6v2a1 1 0 0 0 1 1h11l4 4V7a1 1 0 0 0-1-1z',
  turns: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
}

function NavIcon({ moduleId }: { moduleId: string }) {
  const path = navIcons[moduleId]
  if (!path) return null
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, opacity: 0.7 }}
    >
      <path d={path} />
    </svg>
  )
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const activeModule = getActiveModule(pathname)
  const metrics = useSidebarMetrics()
  const user = useAuthSessionStore((s) => s.user)
  const logout = useAuthSessionStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    await logout()
    navigate({ to: '/login' })
  }, [logout, navigate])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}
        aria-label="Navegacion principal"
      >
        <div className="brand">
          <span className="brand-mark">RE</span>
          <div>
            <strong>Restaurante Enterprise</strong>
            <span>Operacion de sala</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <Link
              aria-current={item.id === activeModule ? 'page' : undefined}
              className={`nav-item animate-fade-in-up stagger-${index + 1}`}
              key={item.id}
              to={item.to}
              onClick={closeSidebar}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <NavIcon moduleId={item.id} />
                {item.label}
              </span>
              <small>{metrics[item.id]}</small>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 4px',
              color: 'var(--text-muted)',
              fontSize: '13px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {userInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--cream)', fontWeight: 500, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.username ?? 'Usuario'}
              </div>
              <div style={{ fontSize: '11px' }}>Sesion activa</div>
            </div>
          </div>
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main id="main-content" className="main-panel">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={sidebarOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        <Outlet />
      </main>
    </div>
  )
}
