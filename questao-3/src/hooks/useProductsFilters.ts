import { useCallback, useMemo, useState } from 'react'
import type { Product, SortField, SortState } from '../types/product'
import { PAGE_SIZE } from '../utils/constants'
import {
  filterProducts,
  getTotalPages,
  paginateProducts,
  sortProducts,
} from '../utils/productFilters'

export function useProductsFilters(products: Product[]) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)

  const changeSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const toggleSort = useCallback((field: SortField) => {
    setSort((current) => {
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

  // Protege contra página órfã, caso a lista encolha por outro caminho que
  // não os handlers de filtro.
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
