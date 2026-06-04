import { useAuthSessionStore } from '../store/authSessionStore'

export function useAuthSession() {
  return useAuthSessionStore((state) => ({
    accessToken: state.accessToken,
    clearSession: state.clearSession,
    isAuthenticated: state.isAuthenticated,
    setSession: state.setSession,
    user: state.user,
  }))
}
