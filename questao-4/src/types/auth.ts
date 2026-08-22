/**
 * Os quatro papéis existentes no backend (`domain/user/IUser.ts`). São fixos:
 * o `authorize` das rotas compara contra exatamente estes valores.
 */
export type UserRole = 'admin' | 'gerente' | 'operador' | 'visualizador'

/**
 * Usuário como o backend devolve — sem `passwordHash`, que nunca sai do
 * servidor. `phone` e `avatarUrl` só vêm em `/auth/me`; o login devolve a
 * versão reduzida, por isso são opcionais.
 */
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

/** Corpo de `data` na resposta de `POST /auth/login`. */
export interface LoginResponse {
  user: User
  accessToken: string
}
