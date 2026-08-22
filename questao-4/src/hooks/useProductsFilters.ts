import { useCallback, useMemo, useState } from 'react'
import type { Product } from '../types/product'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'
import {
  filterByName,
  filterByPriceRange,
  getTotalPages,
  paginate,
  parsePriceInput,
  sortByNewest,
} from '../utils/productFilters'

export function useProductsFilters(products: Product[]) {
  const [name, setName] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)

  const changeName = useCallback((value: string) => {
    setName(value)
    setPage(1)
  }, [])

  const changeMinPrice = useCallback((value: string) => {
    setMinPriceInput(value)
    setPage(1)
  }, [])

  const changeMaxPrice = useCallback((value: string) => {
    setMaxPriceInput(value)
    setPage(1)
  }, [])

  const changePageSize = useCallback((value: number) => {
    setPageSize(value)
    setPage(1)
  }, [])

  const resetPage = useCallback(() => setPage(1), [])

  const clearFilters = useCallback(() => {
    setName('')
    setMinPriceInput('')
    setMaxPriceInput('')
    setPage(1)
  }, [])

  const minPrice = parsePriceInput(minPriceInput)
  const maxPrice = parsePriceInput(maxPriceInput)

  const hasInvertedRange =
    minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice

  const matchedProducts = useMemo(
    () => sortByNewest(filterByPriceRange(filterByName(products, name), minPrice, maxPrice)),
    [products, name, minPrice, maxPrice],
  )

  const totalPages = getTotalPages(matchedProducts.length, pageSize)

  // Excluir o último item de uma página encolhe a lista sem passar por
  // nenhum handler de filtro, e a página atual deixaria de existir.
  const currentPage = Math.min(page, totalPages)

  const visibleProducts = useMemo(
    () => paginate(matchedProducts, currentPage, pageSize),
    [matchedProducts, currentPage, pageSize],
  )

  const hasActiveFilters =
    name.trim().length > 0 || minPrice !== undefined || maxPrice !== undefined

  return {
    name,
    setName: changeName,
    minPriceInput,
    setMinPriceInput: changeMinPrice,
    maxPriceInput,
    setMaxPriceInput: changeMaxPrice,
    hasInvertedRange,
    hasActiveFilters,
    clearFilters,
    resetPage,

    matchedProducts,
    visibleProducts,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: changePageSize,
    totalPages,
  }
}
