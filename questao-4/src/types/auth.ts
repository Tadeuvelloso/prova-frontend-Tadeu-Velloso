export type UserRole = 'admin' | 'gerente' | 'operador' | 'visualizador'

export interface User {
  _id: string
  fullName: string
  email: string
  role: UserRole
  phone?: string
  avatarUrl?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
}
