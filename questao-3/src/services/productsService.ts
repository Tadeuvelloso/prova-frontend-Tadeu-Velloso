// A Fake Store API não tem busca nem paginação: `?q=` e `?offset=` são
// ignorados. O único filtro real é o de categoria, com endpoint dedicado.
import { api } from './api'
import type { Category, Product } from '../types/product'

export async function getProducts(category?: Category): Promise<Product[]> {
  const url = category
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products'

  const { data } = await api.get<Product[]>(url)

  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/products/categories')

  return data
}
