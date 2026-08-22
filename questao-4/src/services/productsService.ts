import { api } from './api'
import type { ApiMessage, ApiSuccess } from '../types/api'
import type {
  CreateProductInput,
  Product,
  ProductFilters,
  UpdateProductInput,
} from '../types/product'

const RESOURCE = '/products'

/**
 * Endpoints de produtos.
 *
 * Camada fina de propósito: monta a requisição e devolve o dado já
 * desembrulhado do envelope `{ success, data }`. Não filtra, não ordena, não
 * pagina e não trata erro — o interceptor já normalizou a falha, e o que a
 * API não faz é resolvido acima, nos hooks.
 */

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { data } = await api.get<ApiSuccess<Product[]>>(RESOURCE, {
    // O Axios omite parâmetros `undefined`, então um filtro não informado
    // simplesmente não vai na query string — e o backend devolve tudo.
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

/**
 * Devolve `void`: a resposta traz só uma mensagem de confirmação, e repassá-la
 * faria a interface exibir texto vindo do servidor onde ela já sabe o que
 * dizer.
 */
export async function deleteProduct(id: string): Promise<void> {
  await api.delete<ApiMessage>(`${RESOURCE}/${id}`)
}
