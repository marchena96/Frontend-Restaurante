import { create } from 'zustand'
import type { AuthUser } from '../types/auth'
import * as authApi from '../api/authApi'

const TOKEN_KEY = 'auth_token'

interface AuthSessionState {
  user: AuthUser | null
  token: string | null
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
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  login: async (credentials) => {
    const res = await authApi.login(credentials)
    localStorage.setItem(TOKEN_KEY, res.token)
    set({ user: res.user, token: res.token, isAuthenticated: true })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      set({ user: null, token: null, isAuthenticated: false })
    }
  },

  initialize: async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    if (!savedToken) {
      set({ isLoading: false, isInitialized: true })
      return
    }
    set({ token: savedToken, isLoading: true })
    const user = await authApi.getMe()
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true })
    } else {
      localStorage.removeItem(TOKEN_KEY)
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, isInitialized: true })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
