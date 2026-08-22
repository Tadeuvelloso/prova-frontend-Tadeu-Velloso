import { useMemo, useState } from 'react'
import type { Product } from '../types/product'
import { filterProducts } from '../utils/productFilters'

/**
 * Busca em memória, e não na API: a Fake Store ignora `?q=`, então o filtro
 * precisa acontecer aqui (verificado por requisição).
 *
 * Sem debounce de propósito — são 20 itens já carregados, sem requisição
 * envolvida a cada tecla. Debounce aqui só adicionaria latência.
 */
export function useProductsFilters(products: Product[]) {
  const [search, setSearch] = useState('')

  const visibleProducts = useMemo(
    () => filterProducts(products, search),
    [products, search],
  )

  return {
    search,
    setSearch,
    visibleProducts,
    totalCount: products.length,
  }
}
