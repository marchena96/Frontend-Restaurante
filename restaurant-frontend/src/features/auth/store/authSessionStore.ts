import { create } from 'zustand'
import type { AuthUser } from '../types/auth'
import * as authApi from '../api/authApi'

interface AuthSessionState {
  user: AuthUser | null
  isAuthenticated: boolean
  isInitialized: boolean
  login: (credentials: authApi.LoginRequestDto) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: AuthUser) => void
  clearSession: () => void
}

export const useAuthSessionStore = create<AuthSessionState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  login: async (credentials) => {
    const user = await authApi.login(credentials)
    set({ user, isAuthenticated: true })
  },

  logout: async () => {
    await authApi.logout()
    set({ user: null, isAuthenticated: false })
  },

  initialize: async () => {
    try {
      const user = await authApi.getMe()
      set({ user, isAuthenticated: true, isInitialized: true })
    } catch {
      set({ user: null, isAuthenticated: false, isInitialized: true })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
}))
