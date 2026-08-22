import { env } from './env'

export const API_CONFIG = {
  baseURL: env.apiUrl,

  /**
   * 60s, e não os 10s que eu usaria contra uma API normal.
   *
   * O backend está hospedado no plano gratuito do Render, que hiberna o
   * serviço após ~15 minutos sem tráfego. A primeira requisição depois disso
   * espera o container subir e pode levar perto de um minuto. Um timeout
   * curto transformaria essa espera — que é normal e se resolve sozinha — em
   * erro de conexão logo na tela de login.
   */
  timeout: 60_000,
} as const
