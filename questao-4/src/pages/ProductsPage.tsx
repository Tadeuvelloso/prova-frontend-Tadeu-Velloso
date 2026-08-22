import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Pagination } from '../components/common/Pagination'
import { ProductsFilters } from '../components/modules/ProductsFilters/ProductsFilters'
import { ProductsList } from '../components/modules/ProductsTable/ProductsList'
import { DeleteProductDialog } from '../components/modules/ProductsTable/DeleteProductDialog'
import { ProductsTableSkeleton } from '../components/modules/ProductsTable/ProductsTableSkeleton'
import { useProductMutations } from '../hooks/useProductMutations'
import { useProducts } from '../hooks/useProducts'
import { useProductsFilters } from '../hooks/useProductsFilters'
import { useAuthStore } from '../store/authStore'
import type { Product, ProductStatusFilter } from '../types/product'
import { can } from '../utils/permissions'
import { statusToFilters } from '../utils/productFilters'

export function ProductsPage() {
  const [status, setStatus] = useState<ProductStatusFilter>('all')

  const serverFilters = useMemo(() => statusToFilters(status), [status])
  const { data, isPending, isError, error, refetch, isFetching } = useProducts(serverFilters)

  const products = useMemo(() => data ?? [], [data])
  const filters = useProductsFilters(products)

  const role = useAuthStore((state) => state.user?.role)
  const canCreate = can(role, 'create')
  const canEdit = can(role, 'update')
  const canDelete = can(role, 'delete')

  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const { remove } = useProductMutations()

  const isFiltering = filters.hasActiveFilters || status !== 'all'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-content">
          Produtos
        </h2>

        {!isPending && !isError && (
          <p aria-live="polite" className="font-mono text-xs text-content-muted tabular-nums">
            {formatCount(filters.matchedProducts.length, products.length, isFiltering)}
          </p>
        )}

        {canCreate && (
          <Link
            to="/produtos/novo"
            className="ml-auto rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast transition-colors hover:bg-brand-hover"
          >
            Novo produto
          </Link>
        )}
      </div>

      <ProductsFilters
        name={filters.name}
        onNameChange={filters.setName}
        minPrice={filters.minPriceInput}
        onMinPriceChange={filters.setMinPriceInput}
        maxPrice={filters.maxPriceInput}
        onMaxPriceChange={filters.setMaxPriceInput}
        status={status}
        onStatusChange={(value) => {
          setStatus(value)
          filters.resetPage()
        }}
        hasInvertedRange={filters.hasInvertedRange}
        hasActiveFilters={isFiltering}
        onClear={() => {
          filters.clearFilters()
          setStatus('all')
        }}
      />

      {isPending ? (
        <ProductsTableSkeleton />
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'Ocorreu um erro inesperado.'}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      ) : filters.matchedProducts.length === 0 ? (
        <EmptyResult
          isFiltering={isFiltering}
          onClear={() => {
            filters.clearFilters()
            setStatus('all')
          }}
        />
      ) : (
        <>
          <div
            className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}
          >
            <ProductsList
              products={filters.visibleProducts}
              canEdit={canEdit}
              canDelete={canDelete}
              onDelete={setProductToDelete}
            />
          </div>

          <Pagination
            page={filters.page}
            totalPages={filters.totalPages}
            pageSize={filters.pageSize}
            totalItems={filters.matchedProducts.length}
            onPageChange={filters.setPage}
            onPageSizeChange={filters.setPageSize}
          />
        </>
      )}

      <DeleteProductDialog
        product={productToDelete}
        isDeleting={remove.isPending}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => {
          if (!productToDelete) return

          remove.mutate(productToDelete, {
            onSuccess: () => setProductToDelete(null),
          })
        }}
      />
    </div>
  )
}

function EmptyResult({
  isFiltering,
  onClear,
}: {
  isFiltering: boolean
  onClear: () => void
}) {
  if (!isFiltering) {
    return (
      <EmptyState
        title="Nenhum produto cadastrado"
        description="O catálogo está vazio. Cadastre o primeiro produto para começar."
      />
    )
  }

  return (
    <EmptyState
      title="Nenhum produto encontrado"
      description="Nenhum produto corresponde aos filtros aplicados. Ajuste a busca ou limpe os filtros."
      action={
        <Button variant="secondary" onClick={onClear}>
          Limpar filtros
        </Button>
      }
    />
  )
}

function formatCount(matched: number, total: number, isFiltering: boolean): string {
  if (isFiltering) return `${matched} de ${total}`

  return total === 1 ? '1 produto' : `${total} produtos`
}
