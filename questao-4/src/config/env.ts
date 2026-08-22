/**
 * Ponto único de leitura das variáveis de ambiente.
 *
 * Nenhum outro arquivo toca em `import.meta.env`: assim a origem de cada valor
 * fica rastreável e trocar de fonte (env, arquivo de config, endpoint remoto)
 * não vira uma varredura no projeto.
 */

/**
 * O fallback é deliberado, não descuido. A API é pública e conhecida, e o
 * projeto é entregue para avaliação — `npm install && npm run dev` precisa
 * funcionar sem que ninguém crie um `.env` antes. Em produção o valor viria
 * da env e este padrão nunca seria usado.
 */
const FALLBACK_API_URL = 'https://distribuidora-backend-m46a.onrender.com/api'

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const env = {
  apiUrl: configuredApiUrl || FALLBACK_API_URL,
} as const
