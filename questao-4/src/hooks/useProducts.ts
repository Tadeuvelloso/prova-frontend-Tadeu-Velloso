import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../config/queryKeys'
import { listProducts } from '../services/productsService'
import type { ProductFilters } from '../types/product'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => listProducts(filters),

    placeholderData: keepPreviousData,
  })
}
