import { createRoute } from '@tanstack/react-router'
import { ReservationsPage } from '../pages/ReservationsPage'
import { rootRoute } from './__root'

export const reservationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reservations',
  component: ReservationsPage,
})
