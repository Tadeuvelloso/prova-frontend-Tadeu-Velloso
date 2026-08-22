import { api } from './api'
import type { Category, Product } from '../types/product'

/**
 * Camada de acesso à API, sem regra de negócio.
 *
 * Busca, ordenação e paginação NÃO são feitas aqui porque a Fake Store API não
 * as suporta: `?q=` é ignorado, `?sort=` só inverte por `id` e não há `offset`.
 * Essas operações ficam no cliente, em `useProductsFilters`.
 */

export async function getProducts(category?: Category): Promise<Product[]> {
  // Categoria é o único filtro com endpoint próprio, então vai para o servidor.
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
