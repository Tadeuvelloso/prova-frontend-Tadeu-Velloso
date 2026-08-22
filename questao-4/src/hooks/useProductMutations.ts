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

export function useProductMutations() {
  const queryClient = useQueryClient()

  function invalidateLists() {
    // Alveja o prefixo: o filtro de status entra na chave, então existe um
    // cache por combinação e invalidar só a visível deixaria as outras velhas.
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
      queryClient.setQueryData(queryKeys.product(product._id), product)
      notify.success(`Produto “${product.name}” atualizado.`)
    },
  })

  const remove = useMutation<void, AppError, Product>({
    mutationFn: (product) => deleteProduct(product._id),
    onSuccess: (_result, product) => {
      void invalidateLists()
      queryClient.removeQueries({ queryKey: queryKeys.product(product._id) })
      notify.success(`Produto “${product.name}” excluído.`)
    },
    onError: (error) => notify.error(error.message),
  })

  return { create, update, remove }
}
