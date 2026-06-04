import type { EntityId } from '../../../shared/types'

export interface ClientResponse {
  id: EntityId
  fullName: string
  phoneNumber: string
  email?: string
  visitCount: number
  lastVisitAt?: string
}
