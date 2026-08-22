import type { ProductFilters } from '../types/product'

export const queryKeys = {
  authMe: ['auth', 'me'] as const,

  products: (filters: ProductFilters = {}) => ['products', filters] as const,

  productsRoot: ['products'] as const,

  product: (id: string) => ['product', id] as const,
} as const
