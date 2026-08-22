/**
 * Produto como o backend devolve (`domain/product/IProduct.ts`).
 *
 * `createdAt` e `updatedAt` são `string`, e não `Date`: o backend tipa como
 * `Date`, mas o que trafega é JSON, e JSON não tem tipo data — chegam aqui
 * como ISO 8601. Tipar como `Date` seria uma mentira que só apareceria em
 * runtime, ao chamar um método que a string não tem.
 */
export interface Product {
  _id: string
  name: string
  sku: string
  barcode?: string
  description?: string
  category: string
  stock: number
  minStockAlert: number
  costAverage: number
  purchasePrice: number
  salePrice: number
  branchId?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Campos que o formulário de cadastro envia.
 *
 * O `CreateProductSchema` do backend aceita mais — `barcode`, `description`,
 * `stock`, `minStockAlert` e `costAverage` — mas todos têm valor padrão lá
 * (`stock` 0, `minStockAlert` 10, `costAverage` 0). Omiti-los mantém o
 * formulário no essencial sem quebrar o contrato.
 */
export interface CreateProductInput {
  name: string
  sku: string
  category: string
  purchasePrice: number
  salePrice: number
  active: boolean
}

/**
 * Campos que a edição pode alterar.
 *
 * Derivado do input de criação **sem o `sku`** de propósito: o
 * `UpdateProductSchema` do backend não declara esse campo, ou seja, o SKU é
 * imutável depois de criado. Expressar isso no tipo faz o compilador impedir
 * o envio, em vez de deixar a regra só num comentário.
 */
export type UpdateProductInput = Partial<Omit<CreateProductInput, 'sku'>>

/**
 * Filtros que a API realmente aplica.
 *
 * Só `active` é usado pela interface. O backend também aceita `category`,
 * `branchId` e `lowStock`, mas **não** filtra por nome nem por faixa de preço
 * e não pagina — verifiquei chamando os endpoints. Por isso busca, faixa de
 * preço e paginação acontecem no cliente.
 */
export interface ProductFilters {
  active?: boolean
}

/**
 * Como o status aparece na interface.
 *
 * Três opções, e não um booleano, porque "todos" é um estado legítimo e
 * diferente de "ativos": é a ausência do filtro.
 */
export type ProductStatusFilter = 'all' | 'active' | 'inactive'
