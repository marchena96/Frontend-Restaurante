import type { EntityId } from '../../../shared/types'

export interface AuthUser {
  id: EntityId
  fullName: string
  email: string
  roles: readonly string[]
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}
