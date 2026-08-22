/**
 * Contratos de resposta do backend.
 *
 * Toda rota responde envelopada — sucesso em `{ success: true, data }` e falha
 * em `{ success: false, message, statusCode, context, details? }` — conforme
 * `infrastructure/http/middlewares/error-handler.ts` do backend.
 */

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiErrorPayload {
  success: false
  message: string
  statusCode: number
  context: string
  /**
   * Só vem em alguns erros, e com formato variável: o middleware de validação
   * manda um array `{ path, message }` vindo do Zod, enquanto o de autorização
   * manda `{ requiredRoles, userRole }`. Por isso `unknown` — quem for
   * consumir precisa estreitar o tipo antes.
   */
  details?: unknown
}

/** Formato de `details` quando a validação do backend rejeita o corpo. */
export interface ApiValidationDetail {
  path: string
  message: string
}
