import type { Product } from '../types/product'

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
