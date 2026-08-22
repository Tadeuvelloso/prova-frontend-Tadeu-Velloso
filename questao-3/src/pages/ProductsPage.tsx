import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { ProductsTable } from '../components/modules/ProductsTable/ProductsTable'
import { useProducts } from '../hooks/useProducts'

export function ProductsPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useProducts()

  if (isPending) {
    return (
      <p role="status" className="py-14 text-center text-content-muted">
        Carregando produtos…
      </p>
    )
  }

  if (isError) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => {
          refetch()
        }}
        isRetrying={isFetching}
      />
    )
  }

  if (data.length === 0) {
    return <EmptyState title="Nenhum produto encontrado" />
  }

  return <ProductsTable products={data} />
}
