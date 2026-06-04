import { createRoute } from '@tanstack/react-router'
import { InfrastructurePage } from '../pages/InfrastructurePage'
import { rootRoute } from './__root'

export const infrastructureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/infrastructure',
  component: InfrastructurePage,
})
