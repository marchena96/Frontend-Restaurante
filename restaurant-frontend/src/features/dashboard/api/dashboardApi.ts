import { httpClient } from '@/shared/api/httpClient'
import type { DashboardResponse } from '../types/dashboard'

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await httpClient.get<DashboardResponse>('/dashboard')
  return data
}
