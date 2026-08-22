/**
 * Fake Store API: https://fakestoreapi.com
 * Não exige autenticação, portanto não há token nem variável de ambiente.
 * Em um cenário real este valor viria de `import.meta.env.VITE_API_URL`.
 */

export const API_CONFIG = {
  baseURL: 'https://fakestoreapi.com',
  timeout: 10_000,
} as const
