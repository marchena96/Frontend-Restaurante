import { useAuthSessionStore } from '../store/authSessionStore'

export function useAuthSession() {
  return useAuthSessionStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    login: state.login,
    logout: state.logout,
    initialize: state.initialize,
    clearSession: state.clearSession,
  }))
}
