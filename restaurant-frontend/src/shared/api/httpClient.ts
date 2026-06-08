import axios from 'axios'
import { env } from '../../config/env'

function normalizeBaseUrl(url: string): string {
  const trimmed = url.replace(/\/+$/, '')
  if (/\/api$/.test(trimmed)) return trimmed
  return `${trimmed}/api`
}

export const httpClient = axios.create({
  baseURL: normalizeBaseUrl(env.VITE_API_BASE_URL),
  timeout: env.VITE_API_TIMEOUT,
  withCredentials: true,
})
