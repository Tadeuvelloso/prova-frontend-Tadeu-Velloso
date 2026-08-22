import type { Product, ProductFilters, ProductStatusFilter } from '../types/product'

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function filterByName(products: Product[], term: string): Product[] {
  const needle = normalize(term)
  if (!needle) return products

  return products.filter((product) => normalize(product.name).includes(needle))
}

export function filterByPriceRange(
  products: Product[],
  min?: number,
  max?: number,
): Product[] {
  if (min === undefined && max === undefined) return products

  return products.filter((product) => {
    const price = product.salePrice

    if (min !== undefined && price < min) return false
    if (max !== undefined && price > max) return false

    return true
  })
}

// A cópia é obrigatória: `sort` muta e este array vem do cache do React Query.
export function sortByNewest(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize

  return items.slice(start, start + pageSize)
}

export function statusToFilters(status: ProductStatusFilter): ProductFilters {
  if (status === 'active') return { active: true }
  if (status === 'inactive') return { active: false }

  return {}
}

export function parsePriceInput(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined

  const parsed = Number(trimmed.replace(',', '.'))

  return Number.isFinite(parsed) ? parsed : undefined
}
