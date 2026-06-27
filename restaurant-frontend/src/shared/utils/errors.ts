import type { AxiosError } from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? axiosError.message ?? fallback
}
