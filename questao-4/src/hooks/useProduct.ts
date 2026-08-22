import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../config/queryKeys'
import { getProduct } from '../services/productsService'

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.product(id ?? ''),
    queryFn: () => getProduct(id as string),
    enabled: Boolean(id),
  })
}
