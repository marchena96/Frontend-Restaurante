export interface AuthUser {
  id: number
  username: string
  role: string
}

export interface AuthSession {
  user: AuthUser
}
