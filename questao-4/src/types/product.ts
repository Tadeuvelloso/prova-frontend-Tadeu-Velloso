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

export interface CreateProductInput {
  name: string
  sku: string
  category: string
  purchasePrice: number
  salePrice: number
  active: boolean
}

// Sem `sku`: o schema de atualização do backend não declara esse campo, ou
// seja, o SKU é imutável depois de criado.
export type UpdateProductInput = Partial<Omit<CreateProductInput, 'sku'>>

// Só `active` é aplicado pela API. Ela não filtra por nome nem por faixa de
// preço e não pagina — por isso essas três coisas acontecem no cliente.
export interface ProductFilters {
  active?: boolean
}

export type ProductStatusFilter = 'all' | 'active' | 'inactive'
