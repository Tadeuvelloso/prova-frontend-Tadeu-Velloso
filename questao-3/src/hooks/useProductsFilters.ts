import { useCallback, useMemo, useState } from 'react'
import type { Product, SortField, SortState } from '../types/product'
import { filterProducts, sortProducts } from '../utils/productFilters'

/**
 * Busca e ordenação em memória, e não na API: a Fake Store ignora `?q=` e o
 * seu `?sort=` só inverte por `id` (verificado por requisição).
 *
 * Sem debounce na busca de propósito — são 20 itens já carregados, sem
 * requisição envolvida a cada tecla. Debounce aqui só adicionaria latência.
 */
export function useProductsFilters(products: Product[]) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)

  const toggleSort = useCallback((field: SortField) => {
    setSort((current) => {
      // Coluna nova começa em ascendente; a mesma coluna inverte a direção.
      if (current?.field !== field) return { field, order: 'asc' }

      return { field, order: current.order === 'asc' ? 'desc' : 'asc' }
    })
  }, [])

  const visibleProducts = useMemo(
    () => sortProducts(filterProducts(products, search), sort),
    [products, search, sort],
  )

  return {
    search,
    setSearch,
    sort,
    toggleSort,
    visibleProducts,
    totalCount: products.length,
  }
}
