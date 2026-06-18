import type { RestaurantModule } from '../types'

export interface NavItem {
  id: RestaurantModule
  label: string
  metric: string
  to: string
}

export const ADMIN_BASE = '/admin'

export const navItems: readonly NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', metric: 'Hoy', to: ADMIN_BASE },
  { id: 'clients', label: 'Comensales', metric: '128', to: `${ADMIN_BASE}/clients` },
  { id: 'infrastructure', label: 'Salon', metric: '24 mesas', to: `${ADMIN_BASE}/infrastructure` },
  { id: 'reservations', label: 'Reservas', metric: '36', to: `${ADMIN_BASE}/reservations` },
  { id: 'waiting-list', label: 'Espera', metric: '9', to: `${ADMIN_BASE}/waiting-list` },
  { id: 'turns', label: 'Turnos', metric: '3', to: `${ADMIN_BASE}/turns` },
] as const

export function getActiveModule(pathname: string): RestaurantModule {
  const sorted = [...navItems].sort((a, b) => b.to.length - a.to.length)
  const match = sorted.find((item) => pathname.startsWith(item.to))
  return match?.id ?? 'dashboard'
}
