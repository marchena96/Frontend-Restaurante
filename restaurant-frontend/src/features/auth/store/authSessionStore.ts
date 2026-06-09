import { create } from 'zustand'
import type { AuthUser } from '../types/auth'
import * as authApi from '../api/authApi'

interface AuthSessionState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
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
  isLoading: true,
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
    set({ isLoading: true })
    const user = await authApi.getMe()
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true })
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
}))
