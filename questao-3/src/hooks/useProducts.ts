import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productsService'
import type { Category } from '../types/product'

/**
 * A categoria entra na `queryKey`, e não apenas na URL: é isso que dá cache
 * por categoria e que elimina a race condition de respostas fora de ordem
 * quando o usuário troca o filtro rápido.
 */
export const productsQueryKey = (category?: Category) =>
  ['products', category ?? 'all'] as const

export function useProducts(category?: Category) {
  return useQuery({
    queryKey: productsQueryKey(category),
    queryFn: () => getProducts(category),
  })
}
