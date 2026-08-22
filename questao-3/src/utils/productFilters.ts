import type { Product, SortField, SortState } from '../types/product'

function matchesSearch(product: Product, term: string): boolean {
  return (
    product.title.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  )
}

export function filterProducts(products: Product[], search: string): Product[] {
  const term = search.trim().toLowerCase()
  if (!term) return products

  return products.filter((product) => matchesSearch(product, term))
}

const comparators: Record<SortField, (a: Product, b: Product) => number> = {
  title: (a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }),
  price: (a, b) => a.price - b.price,
  rating: (a, b) => a.rating.rate - b.rating.rate,
}

export function sortProducts(products: Product[], sort: SortState | null): Product[] {
  if (!sort) return products

  const compare = comparators[sort.field]
  const direction = sort.order === 'asc' ? 1 : -1

  // A cópia é obrigatória: `sort` muta e este array vem do cache do React Query.
  return [...products].sort((a, b) => compare(a, b) * direction)
}

export function getTotalPages(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize))
}

export function paginateProducts(
  products: Product[],
  page: number,
  pageSize: number,
): Product[] {
  const start = (page - 1) * pageSize

  return products.slice(start, start + pageSize)
}
