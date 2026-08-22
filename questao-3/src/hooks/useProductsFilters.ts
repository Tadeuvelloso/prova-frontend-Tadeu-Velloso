import { useCallback, useMemo, useState } from 'react'
import type { Product, SortField, SortState } from '../types/product'
import { PAGE_SIZE } from '../utils/constants'
import {
  filterProducts,
  getTotalPages,
  paginateProducts,
  sortProducts,
} from '../utils/productFilters'

/**
 * Busca, ordenação e paginação em memória, e não na API: a Fake Store ignora
 * `?q=` e `?offset=`, e o seu `?sort=` só inverte por `id` (verificado por
 * requisição).
 *
 * Sem debounce na busca de propósito — são 20 itens já carregados, sem
 * requisição envolvida a cada tecla. Debounce aqui só adicionaria latência.
 */
export function useProductsFilters(products: Product[]) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)

  // Filtrar ou reordenar muda quais itens caem em cada página, então voltar
  // para a primeira é feito no próprio handler — não em um efeito reagindo
  // à mudança depois que ela já aconteceu.
  const changeSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const toggleSort = useCallback((field: SortField) => {
    setSort((current) => {
      // Coluna nova começa em ascendente; a mesma coluna inverte a direção.
      if (current?.field !== field) return { field, order: 'asc' }

      return { field, order: current.order === 'asc' ? 'desc' : 'asc' }
    })
    setPage(1)
  }, [])

  const resetPage = useCallback(() => setPage(1), [])

  const matchedProducts = useMemo(
    () => sortProducts(filterProducts(products, search), sort),
    [products, search, sort],
  )

  const totalPages = getTotalPages(matchedProducts.length, PAGE_SIZE)

  // Protege contra página órfã: se a lista encolher, a página atual pode ter
  // deixado de existir.
  const currentPage = Math.min(page, totalPages)

  const visibleProducts = useMemo(
    () => paginateProducts(matchedProducts, currentPage, PAGE_SIZE),
    [matchedProducts, currentPage],
  )

  return {
    search,
    setSearch: changeSearch,
    sort,
    toggleSort,
    page: currentPage,
    setPage,
    resetPage,
    totalPages,
    visibleProducts,
    matchedCount: matchedProducts.length,
    totalCount: products.length,
  }
}
