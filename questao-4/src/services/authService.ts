import { api } from './api'
import type { ApiSuccess } from '../types/api'
import type { LoginCredentials, LoginResponse, User } from '../types/auth'

/**
 * Endpoints de autenticação.
 *
 * Os services só montam a requisição e devolvem o dado já desembrulhado do
 * envelope `{ success, data }`. Não guardam estado, não emitem feedback e não
 * decidem o que fazer com a falha — isso é dos hooks e dos componentes.
 *
 * `POST /auth/register` existe na API mas não aparece aqui de propósito: a
 * rota é protegida por `authorize([ADMIN])`, ou seja, só um administrador já
 * autenticado cria usuários. Uma tela pública de cadastro receberia 401 antes
 * de chegar ao banco.
 */

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<ApiSuccess<LoginResponse>>('/auth/login', credentials)

  return data.data
}

/**
 * Valida o token atual e devolve o usuário dele.
 *
 * É o que permite confiar num token vindo do localStorage: sem esta chamada,
 * a aplicação assumiria que qualquer string guardada ainda é válida.
 */
export async function getMe(): Promise<User> {
  const { data } = await api.get<ApiSuccess<User>>('/auth/me')

  return data.data
}
