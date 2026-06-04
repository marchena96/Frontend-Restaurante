import axios from 'axios'
import { env } from '../../config/env'

export const httpClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT,
})

httpClient.interceptors.request.use((config) => {
  const rawSession = window.localStorage.getItem('restaurant.auth.session')
  const session = rawSession ? JSON.parse(rawSession) : null
  const token =
    typeof session?.state?.accessToken === 'string'
      ? session.state.accessToken
      : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
