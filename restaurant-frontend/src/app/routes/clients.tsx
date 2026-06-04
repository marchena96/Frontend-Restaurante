import { createRoute } from '@tanstack/react-router'
import { ClientsPage } from '../pages/ClientsPage'
import { rootRoute } from './__root'

export const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: ClientsPage,
})
