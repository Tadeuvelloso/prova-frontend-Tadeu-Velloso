import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { SearchInput } from '../components/common/SearchInput'
import { ProductsTable } from '../components/modules/ProductsTable/ProductsTable'
import { useProducts } from '../hooks/useProducts'
import { useProductsFilters } from '../hooks/useProductsFilters'

export function ProductsPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useProducts()

  // Chamado antes dos early returns: hook não pode ficar atrás de condicional.
  const { search, setSearch, visibleProducts, totalCount } = useProductsFilters(data ?? [])

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

  const hasSearch = search.trim().length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar por nome ou categoria…"
        />

        <p aria-live="polite" className="text-sm text-content-muted">
          {hasSearch
            ? `${visibleProducts.length} de ${totalCount} produtos`
            : `${totalCount} produtos`}
        </p>
      </div>

      {visibleProducts.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description={
            hasSearch ? `Nada corresponde a “${search.trim()}”. Tente outro termo.` : undefined
          }
        />
      ) : (
        <ProductsTable products={visibleProducts} />
      )}
    </div>
  )
}
