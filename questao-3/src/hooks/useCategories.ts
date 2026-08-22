import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../services/productsService'

export const categoriesQueryKey = ['categories'] as const

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getCategories,
  })
}
