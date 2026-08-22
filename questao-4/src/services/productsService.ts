import { api } from './api'
import type { ApiMessage, ApiSuccess } from '../types/api'
import type {
  CreateProductInput,
  Product,
  ProductFilters,
  UpdateProductInput,
} from '../types/product'

const RESOURCE = '/products'

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { data } = await api.get<ApiSuccess<Product[]>>(RESOURCE, {
    params: { active: filters.active },
  })

  return data.data
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<ApiSuccess<Product>>(`${RESOURCE}/${id}`)

  return data.data
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const { data } = await api.post<ApiSuccess<Product>>(RESOURCE, input)

  return data.data
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const { data } = await api.put<ApiSuccess<Product>>(`${RESOURCE}/${id}`, input)

  return data.data
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete<ApiMessage>(`${RESOURCE}/${id}`)
}
