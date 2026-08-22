import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../config/queryKeys'
import { createProduct, deleteProduct, updateProduct } from '../services/productsService'
import type { CreateProductInput, Product, UpdateProductInput } from '../types/product'
import type { AppError } from '../utils/errorHandler'
import { notify } from '../utils/notify'

interface UpdateVariables {
  id: string
  input: UpdateProductInput
}

/**
 * Escrita de produtos.
 *
 * O hook cuida do que é igual em toda mutação — invalidar o cache e confirmar
 * ao usuário. O que é específico da tela (navegar, marcar erro em campo) fica
 * com quem chamou, pelos callbacks do `mutate`. Assim o hook não precisa
 * conhecer roteamento nem formulário.
 *
 * Não há atualização otimista de propósito: o backend é a autoridade sobre o
 * registro salvo — ele normaliza campos e aplica defaults — e antecipar o
 * resultado na tela abriria espaço para mostrar um dado que o servidor
 * gravou diferente.
 */
export function useProductMutations() {
  const queryClient = useQueryClient()

  function invalidateLists() {
    // Invalida o prefixo, e não a chave da listagem visível: cada combinação
    // de filtro tem seu próprio cache, e as outras ficariam desatualizadas.
    return queryClient.invalidateQueries({ queryKey: queryKeys.productsRoot })
  }

  const create = useMutation<Product, AppError, CreateProductInput>({
    mutationFn: createProduct,
    onSuccess: (product) => {
      void invalidateLists()
      notify.success(`Produto “${product.name}” cadastrado.`)
    },
  })

  const update = useMutation<Product, AppError, UpdateVariables>({
    mutationFn: ({ id, input }) => updateProduct(id, input),
    onSuccess: (product) => {
      void invalidateLists()
      // Atualiza também o cache do item, para a tela de edição não reexibir
      // por um instante o valor antigo se for reaberta.
      queryClient.setQueryData(queryKeys.product(product._id), product)
      notify.success(`Produto “${product.name}” atualizado.`)
    },
  })

  /**
   * Recebe o produto inteiro, e não só o id, para nomeá-lo na confirmação —
   * depois da exclusão ele não existe mais para ser consultado.
   */
  const remove = useMutation<void, AppError, Product>({
    mutationFn: (product) => deleteProduct(product._id),
    onSuccess: (_result, product) => {
      void invalidateLists()
      // Descarta o cache do item: mantê-lo faria a rota de edição exibir por
      // um instante um produto que já não existe.
      queryClient.removeQueries({ queryKey: queryKeys.product(product._id) })
      notify.success(`Produto “${product.name}” excluído.`)
    },
    // Diferente do formulário, aqui não há campo onde pousar a mensagem: a
    // exclusão acontece a partir da lista, então o aviso é geral.
    onError: (error) => notify.error(error.message),
  })

  return { create, update, remove }
}
