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

/**
 * Estado dos filtros que rodam no cliente — nome e faixa de preço — e da
 * paginação.
 *
 * O status fica de fora de propósito: ele vai à API e por isso mora na
 * página, onde entra na chave da query. Este hook só trabalha sobre a lista
 * que já chegou.
 *
 * **Sem debounce na busca**, e é uma decisão, não esquecimento: os itens já
 * estão em memória e nenhuma requisição sai por tecla. Debounce aqui só
 * adicionaria atraso entre digitar e ver o resultado.
 */
export function useProductsFilters(products: Product[]) {
  // Os preços ficam como texto, e não como número: o campo precisa distinguir
  // "vazio" de "zero", e um `number | undefined` no estado tornaria a
  // digitação de valores intermediários desconfortável.
  const [name, setName] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)

  /**
   * Voltar para a primeira página acontece **no handler que causou a
   * mudança**, e não num efeito que observa o filtro depois do fato.
   *
   * A diferença é real: com efeito, a tela chega a renderizar uma vez na
   * página 4 de uma lista que agora só tem 2 páginas — um piscar de conteúdo
   * vazio antes da correção.
   */
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

  /**
   * Faixa invertida não é erro de digitação a ser corrigido no lugar do
   * usuário: é uma condição que não casa com nada. A filtragem acontece
   * normalmente e devolve lista vazia; o aviso explica o motivo, em vez de
   * deixar a pessoa encarando o estado vazio sem entender.
   */
  const hasInvertedRange =
    minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice

  const matchedProducts = useMemo(
    () => sortByNewest(filterByPriceRange(filterByName(products, name), minPrice, maxPrice)),
    [products, name, minPrice, maxPrice],
  )

  const totalPages = getTotalPages(matchedProducts.length, pageSize)

  /**
   * Protege contra página órfã. Excluir o último item de uma página faz a
   * lista encolher sem que nenhum handler de filtro tenha sido acionado — sem
   * este limite, a tela ficaria numa página que deixou de existir, mostrando
   * o vazio.
   */
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
