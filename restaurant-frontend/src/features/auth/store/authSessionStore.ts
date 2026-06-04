import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthSession, AuthUser } from '../types/auth'

interface AuthSessionState {
  accessToken: string | null
  isAuthenticated: boolean
  user: AuthUser | null
  clearSession: () => void
  setSession: (session: AuthSession) => void
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,
      clearSession: () =>
        set({
          accessToken: null,
          isAuthenticated: false,
          user: null,
        }),
      setSession: (session) =>
        set({
          accessToken: session.accessToken,
          isAuthenticated: true,
          user: session.user,
        }),
    }),
    {
      name: 'restaurant.auth.session',
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
)
