import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../config/queryKeys'
import { listProducts } from '../services/productsService'
import type { ProductFilters } from '../types/product'

/**
 * Carrega a listagem de produtos.
 *
 * O componente não conhece Axios, React Query ou o formato da resposta: pede
 * a lista e recebe dados, carregando e erro.
 */
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => listProducts(filters),

    // Mantém a tabela anterior na tela enquanto a nova consulta carrega, em
    // vez de trocar tudo pelo esqueleto a cada mudança de filtro. Sem isto, o
    // layout pisca e a posição de leitura se perde.
    placeholderData: keepPreviousData,
  })
}
