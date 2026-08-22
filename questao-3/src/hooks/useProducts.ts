import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productsService'
import type { Category } from '../types/product'

export const productsQueryKey = (category?: Category) =>
  ['products', category ?? 'all'] as const

export function useProducts(category?: Category) {
  return useQuery({
    queryKey: productsQueryKey(category),
    queryFn: () => getProducts(category),
    placeholderData: keepPreviousData,
  })
}
