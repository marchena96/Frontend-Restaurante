import { createRouter } from '@tanstack/react-router'
import { clientsRoute } from './routes/clients'
import { indexRoute } from './routes/index'
import { infrastructureRoute } from './routes/infrastructure'
import { reservationsRoute } from './routes/reservations'
import { rootRoute } from './routes/__root'
import { waitingListRoute } from './routes/waiting-list'

const routeTree = rootRoute.addChildren([
  indexRoute,
  clientsRoute,
  infrastructureRoute,
  reservationsRoute,
  waitingListRoute,
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
