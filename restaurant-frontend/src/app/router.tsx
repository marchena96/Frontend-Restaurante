import { createRouter, redirect, Route } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { AdminLayout } from '../shared/layouts/AdminLayout'
import { ClientsPage } from './pages/ClientsPage'
import { DashboardPage } from './pages/DashboardPage'
import { InfrastructurePage } from './pages/InfrastructurePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { WaitingListPage } from './pages/WaitingListPage'
import { TurnsPage } from './pages/TurnsPage'
import { ADMIN_BASE } from '../shared/config/navigation'
import { useAuthSessionStore } from '../features/auth/store/authSessionStore'

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthSessionStore.getState()
    if (isAuthenticated) throw redirect({ to: '/admin' })
    throw redirect({ to: '/login' })
  },
})

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const adminRoute = new Route({
  getParentRoute: () => rootRoute,
  path: ADMIN_BASE,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthSessionStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
  },
  component: AdminLayout,
})

const adminDashboardRoute = new Route({
  getParentRoute: () => adminRoute,
  path: '/',
  component: DashboardPage,
})

const adminClientsRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'clients',
  component: ClientsPage,
})

const adminInfrastructureRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'infrastructure',
  component: InfrastructurePage,
})

const adminReservationsRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'reservations',
  component: ReservationsPage,
})

const adminWaitingListRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'waiting-list',
  component: WaitingListPage,
})

const adminTurnsRoute = new Route({
  getParentRoute: () => adminRoute,
  path: 'turns',
  component: TurnsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminClientsRoute,
    adminInfrastructureRoute,
    adminReservationsRoute,
    adminWaitingListRoute,
    adminTurnsRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}