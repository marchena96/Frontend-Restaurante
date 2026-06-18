import { httpClient } from '../../../shared/api/httpClient'
import type { TurnDto, TurnFormInput } from '../types/turn'

export async function getTurns(): Promise<readonly TurnDto[]> {
  const { data } = await httpClient.get<readonly TurnDto[]>('/turns')
  return data
}

export async function getTurn(id: number): Promise<TurnDto> {
  const { data } = await httpClient.get<TurnDto>(`/turns/${id}`)
  return data
}

export async function createTurn(payload: TurnFormInput): Promise<TurnDto> {
  const { data } = await httpClient.post<TurnDto>('/turns', payload)
  return data
}

export async function updateTurn(id: number, payload: TurnFormInput): Promise<TurnDto> {
  const { data } = await httpClient.put<TurnDto>(`/turns/${id}`, payload)
  return data
}

export async function deleteTurn(id: number): Promise<void> {
  await httpClient.delete(`/turns/${id}`)
}
