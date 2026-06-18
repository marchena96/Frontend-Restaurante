import axios from 'axios'
import { env } from '../../config/env'
import { useAuthSessionStore } from '../../features/auth/store/authSessionStore'
import { useToastStore } from '../store/toastStore'

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
      useToastStore.getState().addToast('Error de conexión con el servidor', 'error')
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
      useToastStore.getState().addToast('Acceso denegado', 'error')
    }

    if (status >= 500) {
      useToastStore.getState().addToast('Error del servidor. Intente nuevamente.', 'error')
    }

    return Promise.reject(error)
  },
)
