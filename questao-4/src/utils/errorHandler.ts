import axios from 'axios'
import type { ApiErrorPayload, ApiValidationDetail } from '../types/api'

export class AppError extends Error {
  status?: number
  context?: string
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

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response
      const payload = toErrorPayload(data)

      // Abaixo de 500 a mensagem do backend já vem em português e específica.
      // De 500 para cima vira "Internal server error", que não orienta o
      // usuário e expõe detalhe interno.
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

export function getValidationDetails(error: AppError): ApiValidationDetail[] | null {
  if (!Array.isArray(error.details)) return null

  const details = error.details.filter(
    (item): item is ApiValidationDetail =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as ApiValidationDetail).path === 'string' &&
      typeof (item as ApiValidationDetail).message === 'string',
  )

  return details.length > 0 ? details : null
}
