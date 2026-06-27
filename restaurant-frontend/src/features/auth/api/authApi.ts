import { httpClient } from '@/shared/api/httpClient'

export interface LoginRequestDto {
  username: string
  password: string
}

export interface UserDto {
  id: number
  username: string
  role: string
}

export interface AuthResponseDto {
  user: UserDto
  token: string
}

export async function login(credentials: LoginRequestDto): Promise<AuthResponseDto> {
  const { data } = await httpClient.post<AuthResponseDto>('/auth/login', credentials)
  return data
}

export async function logout(): Promise<void> {
  await httpClient.post('/auth/logout')
}

export async function getMe(): Promise<UserDto | null> {
  try {
    const { data } = await httpClient.get<UserDto>('/auth/me')
    return data
  } catch {
    return null
  }
}
