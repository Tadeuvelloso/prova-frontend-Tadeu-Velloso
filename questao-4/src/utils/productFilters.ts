import type { Product, ProductFilters, ProductStatusFilter } from '../types/product'

/**
 * Regras de filtragem, como funções puras fora do React.
 *
 * Nenhuma delas conhece estado, hook ou ciclo de render: recebem uma lista e
 * devolvem outra. Isso as torna legíveis isoladamente e testáveis sem montar
 * componente — e é a fronteira que separa a regra de negócio da interface.
 *
 * Filtrar aqui, e não na API, não é preferência: o `GET /products` do backend
 * só aceita `active`, `category`, `branchId` e `lowStock`. Não há parâmetro de
 * nome nem de faixa de preço — verifiquei chamando os endpoints. Num catálogo
 * grande isso precisaria virar query string; sobre a lista já carregada,
 * resolver no cliente é adequado.
 */

/**
 * Remove acentos para comparar.
 *
 * Sem isto, procurar "agua" não encontraria "Água Mineral 500ml" — e ninguém
 * digita acento em campo de busca.
 */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/** Busca por trecho do nome, ignorando acento e caixa. */
export function filterByName(products: Product[], term: string): Product[] {
  const needle = normalize(term)
  if (!needle) return products

  return products.filter((product) => normalize(product.name).includes(needle))
}

/**
 * Faixa de preço sobre o preço de VENDA — é o valor que o usuário da tela
 * enxerga na coluna e o que ele tem em mente ao filtrar. `purchasePrice` é
 * informação de compra, não de catálogo.
 *
 * Cada limite é independente: informar só o mínimo ou só o máximo funciona.
 */
export function filterByPriceRange(
  products: Product[],
  min?: number,
  max?: number,
): Product[] {
  if (min === undefined && max === undefined) return products

  return products.filter((product) => {
    const price = product.salePrice

    if (min !== undefined && price < min) return false
    if (max !== undefined && price > max) return false

    return true
  })
}

/**
 * Quantas páginas a lista ocupa.
 *
 * Nunca devolve zero: uma lista vazia continua sendo "página 1 de 1". Zero
 * faria a página atual virar `Math.min(1, 0) === 0`, um número de página que
 * não existe, e o rodapé exibiria "Página 0 de 0".
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

/** Recorta a fatia visível. `page` começa em 1, como aparece na interface. */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize

  return items.slice(start, start + pageSize)
}

/**
 * Converte a escolha da interface no filtro que vai à API.
 *
 * "Todos" vira objeto vazio de propósito: sem o parâmetro `active`, o backend
 * não aplica filtro nenhum. Mandar `active: undefined` explicitamente teria o
 * mesmo efeito na requisição, mas mudaria a chave de cache do React Query.
 */
export function statusToFilters(status: ProductStatusFilter): ProductFilters {
  if (status === 'active') return { active: true }
  if (status === 'inactive') return { active: false }

  return {}
}

/**
 * Lê o valor digitado num campo de preço.
 *
 * Campo vazio significa "sem limite", e não zero — por isso `undefined` em vez
 * de `0`. A vírgula é aceita porque é como se escreve decimal em português.
 */
export function parsePriceInput(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined

  const parsed = Number(trimmed.replace(',', '.'))

  return Number.isFinite(parsed) ? parsed : undefined
}
