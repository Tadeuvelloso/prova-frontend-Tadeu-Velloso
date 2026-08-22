import axios from 'axios'
import type { ApiErrorInfo } from '../types/api'

export class AppError extends Error implements ApiErrorInfo {
  status?: number
  isNetworkError: boolean

  constructor(message: string, options: { status?: number; isNetworkError?: boolean } = {}) {
    super(message)
    this.name = 'AppError'
    this.status = options.status
    this.isNetworkError = options.isNetworkError ?? false
  }
}

const GENERIC_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.'

const NETWORK_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'

const TIMEOUT_MESSAGE = 'A requisição demorou mais que o esperado. Tente novamente.'

// Mensagens propositalmente genéricas: detalhar o motivo da recusa ajuda quem
// estiver sondando a API. O detalhe técnico fica em `status`, para log.
function messageForStatus(status: number): string {
  if (status === 400) return 'Requisição inválida.'
  if (status === 401) return 'Sessão expirada. Faça login novamente.'
  if (status === 403) return 'Você não tem permissão para acessar este recurso.'
  if (status === 404) return 'Não encontramos o que você procura.'
  if (status === 429) return 'Muitas requisições em sequência. Aguarde um instante.'
  if (status >= 500) return 'O servidor apresentou uma falha. Tente novamente em instantes.'
  return GENERIC_MESSAGE
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status } = error.response
      return new AppError(messageForStatus(status), { status })
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
