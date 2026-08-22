import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../config/queryKeys'
import { getProduct } from '../services/productsService'

/**
 * Carrega um produto pelo id, para a tela de edição.
 *
 * Busca no servidor em vez de aproveitar o item já presente na listagem: o
 * formulário é acessível por link direto (`/produtos/:id/editar`), e nesse
 * caminho não existe listagem carregada. Depender dela faria a página
 * funcionar só quando alcançada por dentro da aplicação.
 */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.product(id ?? ''),
    queryFn: () => getProduct(id as string),
    enabled: Boolean(id),
  })
}
