import { httpClient } from '../../../shared/api/httpClient'
import type { ClientResponse } from '../types/client'

export interface CreateClientPayload {
  fullName: string
  phoneNumber: string
  email?: string
}

export async function getClients(): Promise<readonly ClientResponse[]> {
  const { data } = await httpClient.get<readonly ClientResponse[]>('/clients')
  return data
}

export async function getClient(id: number): Promise<ClientResponse> {
  const { data } = await httpClient.get<ClientResponse>(`/clients/${id}`)
  return data
}

export async function createClient(
  payload: CreateClientPayload,
): Promise<ClientResponse> {
  const { data } = await httpClient.post<ClientResponse>('/clients', payload)
  return data
}

export async function updateClient(
  id: number,
  payload: Partial<CreateClientPayload>,
): Promise<ClientResponse> {
  const { data } = await httpClient.put<ClientResponse>(
    `/clients/${id}`,
    payload,
  )
  return data
}

export async function searchClients(
  query: string,
): Promise<readonly ClientResponse[]> {
  const { data } = await httpClient.get<readonly ClientResponse[]>(
    '/clients/search',
    { params: { query } },
  )
  return data
}
