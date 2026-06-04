import { createRoute } from '@tanstack/react-router'
import { WaitingListPage } from '../pages/WaitingListPage'
import { rootRoute } from './__root'

export const waitingListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/waiting-list',
  component: WaitingListPage,
})
