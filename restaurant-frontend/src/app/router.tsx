import { createRouter, redirect } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { AdminLayout } from './pages/AdminLayout'
import { ClientsPage } from './pages/ClientsPage'
import { DashboardPage } from './pages/DashboardPage'
import { InfrastructurePage } from './pages/InfrastructurePage'
import { LoginPage } from './pages/LoginPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { WaitingListPage } from './pages/WaitingListPage'
import { useAuthSessionStore } from '../features/auth/store/authSessionStore'

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthSessionStore.getState()
    if (isAuthenticated) throw redirect({ to: '/admin' })
    throw redirect({ to: '/login' })
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthSessionStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
  },
  component: AdminLayout,
})

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: DashboardPage,
})

const adminClientsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/clients',
  component: ClientsPage,
})

const adminInfrastructureRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/infrastructure',
  component: InfrastructurePage,
})

const adminReservationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/reservations',
  component: ReservationsPage,
})

const adminWaitingListRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/waiting-list',
  component: WaitingListPage,
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
  ]),
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
