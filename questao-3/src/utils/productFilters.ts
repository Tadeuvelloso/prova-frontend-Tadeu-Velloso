import type { Product, SortField, SortState } from '../types/product'

/**
 * Operações puras sobre a lista de produtos.
 *
 * Vivem fora do hook porque não dependem de React: podem ser lidas, testadas
 * e alteradas sem envolver ciclo de render.
 */

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

  // Cópia antes de ordenar: `Array.sort` muta, e o array vem do cache do
  // React Query — ordenar no lugar corromperia os dados em cache.
  return [...products].sort((a, b) => compare(a, b) * direction)
}
