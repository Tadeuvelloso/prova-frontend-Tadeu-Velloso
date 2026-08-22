import { useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { ProductForm } from '../components/modules/ProductForm/ProductForm'
import { useProduct } from '../hooks/useProduct'
import { useProductMutations } from '../hooks/useProductMutations'
import { DEFAULT_AUTHENTICATED_ROUTE } from '../routes/PublicOnlyRoute'
import type { Product } from '../types/product'
import type { ProductFormValues } from '../utils/validators'

const EMPTY_PRODUCT: ProductFormValues = {
  name: '',
  sku: '',
  category: '',
  // `NaN` e não `0`: o campo precisa nascer vazio, e zero é um preço válido
  // que ficaria pré-preenchido sem ninguém ter digitado.
  purchasePrice: Number.NaN,
  salePrice: Number.NaN,
  active: true,
}

/**
 * Serve o cadastro e a edição.
 *
 * São a mesma tela porque são o mesmo formulário: mudam a origem dos valores
 * iniciais, o endpoint e o rótulo do botão. Duplicar a página para variar
 * essas três coisas criaria dois lugares para corrigir a cada campo novo.
 */
export function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const { data: product, isPending, isError, error, refetch, isFetching } = useProduct(id)
  const { create, update } = useProductMutations()

  function goBackToList() {
    void navigate(DEFAULT_AUTHENTICATED_ROUTE)
  }

  async function handleSubmit(values: ProductFormValues) {
    if (isEditing && id) {
      // O `sku` não vai no payload: o `UpdateProductInput` o exclui, porque o
      // schema do backend não aceita alterá-lo.
      await update.mutateAsync({
        id,
        input: {
          name: values.name,
          category: values.category,
          purchasePrice: values.purchasePrice,
          salePrice: values.salePrice,
          active: values.active,
        },
      })
    } else {
      await create.mutateAsync(values)
    }

    goBackToList()
  }

  if (isEditing && isPending) {
    return <FormSkeleton />
  }

  if (isEditing && isError) {
    return (
      <div className="space-y-4">
        <PageHeading isEditing />
        <ErrorState
          message={error?.message ?? 'Não foi possível carregar o produto.'}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PageHeading isEditing={isEditing} productName={product?.name} />

      <ProductForm
        mode={isEditing ? 'edit' : 'create'}
        defaultValues={product ? toFormValues(product) : EMPTY_PRODUCT}
        isSubmitting={create.isPending || update.isPending}
        // Sem try/catch aqui de propósito: a falha precisa chegar ao
        // `ProductForm`, que é quem tem o `setError` para marcar o campo.
        onSubmit={handleSubmit}
        onCancel={goBackToList}
      />
    </div>
  )
}

function PageHeading({
  isEditing,
  productName,
}: {
  isEditing: boolean
  productName?: string
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold tracking-tight text-content">
        {isEditing ? 'Editar produto' : 'Novo produto'}
      </h2>
      {isEditing && productName && (
        <p className="text-sm text-content-muted">{productName}</p>
      )}
    </div>
  )
}

function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    purchasePrice: product.purchasePrice,
    salePrice: product.salePrice,
    active: product.active,
  }
}

function FormSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando produto"
      className="animate-pulse space-y-6 rounded-lg border border-border-subtle bg-surface p-6 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={index === 0 ? 'sm:col-span-2' : ''}>
            <div className="h-4 w-24 rounded bg-border-subtle" />
            <div className="mt-2 h-9 rounded bg-border-subtle" />
          </div>
        ))}
      </div>
      <div className="h-9 w-40 rounded bg-border-subtle" />
    </div>
  )
}
