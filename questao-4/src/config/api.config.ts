import { env } from './env'

export const API_CONFIG = {
  baseURL: env.apiUrl,

  // O plano gratuito do Render hiberna e a primeira requisição depois disso
  // pode levar perto de um minuto.
  timeout: 60_000,
} as const
