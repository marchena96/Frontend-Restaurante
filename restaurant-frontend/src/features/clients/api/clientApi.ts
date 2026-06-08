import { httpClient } from '../../../shared/api/httpClient'
import type { Client } from '../types/client'

export async function getClients(): Promise<readonly Client[]> {
  const { data } = await httpClient.get<readonly Client[]>('/clients')
  return data
}

export async function getClient(id: number): Promise<Client> {
  const { data } = await httpClient.get<Client>(`/clients/${id}`)
  return data
}

export async function createClient(
  payload: Omit<Client, 'id'>,
): Promise<Client> {
  const { data } = await httpClient.post<Client>('/clients', payload)
  return data
}

export async function updateClient(
  id: number,
  payload: Omit<Client, 'id'>,
): Promise<Client> {
  const { data } = await httpClient.put<Client>(`/clients/${id}`, payload)
  return data
}
