import axios from 'axios'
import { env } from '@/config/env'
import { useAuthSessionStore } from '@/features/auth/store/authSessionStore'
import { notify } from '../utils/toast'

export const httpClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT,
})

httpClient.interceptors.request.use((config) => {
  const token = useAuthSessionStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      notify.error('Error de conexión con el servidor')
      return Promise.reject(error)
    }

    const { status, config } = error.response

    if (status === 401 && !config?.url?.includes('/auth/login')) {
      useAuthSessionStore.getState().clearSession()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    if (status === 403) {
      notify.error('Acceso denegado')
    }

    if (status >= 500) {
      notify.error('Error del servidor. Intente nuevamente.')
    }

    return Promise.reject(error)
  },
)
