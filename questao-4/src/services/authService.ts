import { api } from './api'
import type { ApiSuccess } from '../types/api'
import type { LoginCredentials, LoginResponse, User } from '../types/auth'

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<ApiSuccess<LoginResponse>>('/auth/login', credentials)

  return data.data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<ApiSuccess<User>>('/auth/me')

  return data.data
}
