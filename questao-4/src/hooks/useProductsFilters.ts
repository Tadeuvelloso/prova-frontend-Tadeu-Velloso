import { useMemo, useState } from 'react'
import type { Product } from '../types/product'
import { filterByName, filterByPriceRange, parsePriceInput } from '../utils/productFilters'

/**
 * Estado dos filtros que rodam no cliente: nome e faixa de preço.
 *
 * O status fica de fora de propósito — ele vai à API e por isso mora na
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
    () => filterByPriceRange(filterByName(products, name), minPrice, maxPrice),
    [products, name, minPrice, maxPrice],
  )

  const hasActiveFilters =
    name.trim().length > 0 || minPrice !== undefined || maxPrice !== undefined

  function clearFilters() {
    setName('')
    setMinPriceInput('')
    setMaxPriceInput('')
  }

  return {
    name,
    setName,
    minPriceInput,
    setMinPriceInput,
    maxPriceInput,
    setMaxPriceInput,
    hasInvertedRange,
    hasActiveFilters,
    clearFilters,
    matchedProducts,
  }
}
