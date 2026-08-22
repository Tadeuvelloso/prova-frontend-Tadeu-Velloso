import axios from 'axios'
import type { ApiErrorPayload } from '../types/api'

/**
 * Erro normalizado da aplicação.
 *
 * Estende `Error` (e não um objeto literal) para preservar stack trace e para
 * continuar funcionando com `instanceof`, `console.error` e com o React Query,
 * que trata a rejeição da query como um `Error`.
 */
export class AppError extends Error {
  status?: number
  /** Módulo do backend que originou a falha — para log, não para exibição. */
  context?: string
  /** Payload extra do backend. Formato varia por tipo de erro (ver ApiErrorPayload). */
  details?: unknown
  isNetworkError: boolean

  constructor(
    message: string,
    options: {
      status?: number
      context?: string
      details?: unknown
      isNetworkError?: boolean
    } = {},
  ) {
    super(message)
    this.name = 'AppError'
    this.status = options.status
    this.context = options.context
    this.details = options.details
    this.isNetworkError = options.isNetworkError ?? false
  }
}

const GENERIC_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.'

const NETWORK_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'

const TIMEOUT_MESSAGE =
  'O servidor demorou mais que o esperado para responder. Tente novamente.'

const SERVER_MESSAGE = 'O servidor apresentou uma falha. Tente novamente em instantes.'

/**
 * Mensagem por faixa de status, usada quando a resposta não traz o envelope
 * de erro do backend (um 502 do proxy do Render, por exemplo, devolve HTML).
 */
function messageForStatus(status: number): string {
  if (status === 400) return 'Dados inválidos. Revise os campos e tente novamente.'
  if (status === 401) return 'Sessão expirada. Faça login novamente.'
  if (status === 403) return 'Você não tem permissão para esta ação.'
  if (status === 404) return 'Não encontramos o que você procura.'
  if (status === 429) return 'Muitas requisições em sequência. Aguarde um instante.'
  if (status >= 500) return SERVER_MESSAGE

  return GENERIC_MESSAGE
}

function toErrorPayload(data: unknown): ApiErrorPayload | null {
  if (typeof data !== 'object' || data === null) return null

  const payload = data as Partial<ApiErrorPayload>

  return typeof payload.message === 'string' ? (payload as ApiErrorPayload) : null
}

/**
 * Converte qualquer falha em um `AppError`.
 *
 * Cobre os três cenários que o Axios distingue:
 * 1. `error.response` existe -> o servidor respondeu com status de erro;
 * 2. `error.request` existe  -> a requisição saiu mas não houve resposta
 *    (offline, DNS, CORS, timeout);
 * 3. nenhum dos dois         -> falha ao montar a requisição, ou um erro que
 *    nem veio do Axios.
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response
      const payload = toErrorPayload(data)

      /**
       * Abaixo de 500 a mensagem do backend é melhor do que qualquer tradução
       * por status: ela já vem em português e é específica onde importa
       * ("SKU já cadastrado", "Credenciais inválidas", "Produto não
       * encontrado"). De 500 para cima ela deixa de servir — vira "Internal
       * server error", que não orienta o usuário e ainda expõe detalhe
       * interno para quem estiver sondando a API.
       */
      const message = status < 500 && payload ? payload.message : messageForStatus(status)

      return new AppError(message, {
        status,
        context: payload?.context,
        details: payload?.details,
      })
    }

    if (error.request) {
      const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'

      return new AppError(isTimeout ? TIMEOUT_MESSAGE : NETWORK_MESSAGE, {
        isNetworkError: true,
      })
    }
  }

  return new AppError(GENERIC_MESSAGE)
}
