import { useState } from 'react'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Pagination } from '../components/common/Pagination'
import { SearchInput } from '../components/common/SearchInput'
import { Select } from '../components/common/Select'
import { ProductsTable } from '../components/modules/ProductsTable/ProductsTable'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { useProductsFilters } from '../hooks/useProductsFilters'

const ALL_CATEGORIES = ''

export function ProductsPage() {
  // A categoria fica acima do useProducts porque é o único filtro que vai ao
  // servidor: mudar aqui muda a queryKey e, com ela, a requisição.
  const [category, setCategory] = useState(ALL_CATEGORIES)

  const { data, isPending, isError, error, refetch, isFetching } = useProducts(
    category || undefined,
  )

  // Se as categorias falharem, o select some mas a tabela continua de pé.
  const { data: categories = [] } = useCategories()

  const {
    search,
    setSearch,
    sort,
    toggleSort,
    page,
    setPage,
    resetPage,
    totalPages,
    visibleProducts,
    matchedCount,
    totalCount,
  } = useProductsFilters(data ?? [])

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
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar por nome ou categoria…"
        />

        {categories.length > 0 && (
          <Select
            id="category-filter"
            label="Filtrar por categoria"
            value={category}
            onChange={(value) => {
              setCategory(value)
              resetPage()
            }}
            options={[
              { value: ALL_CATEGORIES, label: 'Todas as categorias' },
              ...categories.map((name) => ({ value: name, label: name })),
            ]}
          />
        )}

        <p aria-live="polite" className="ml-auto text-sm text-content-muted">
          {isFetching
            ? 'Atualizando…'
            : hasSearch
              ? `${matchedCount} de ${totalCount} produtos`
              : `${totalCount} produtos`}
        </p>
      </div>

      {visibleProducts.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description={
            hasSearch
              ? `Nada corresponde a “${search.trim()}”. Tente outro termo.`
              : 'Esta categoria não tem produtos.'
          }
        />
      ) : (
        <>
          <div
            className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}
          >
            <ProductsTable products={visibleProducts} sort={sort} onSort={toggleSort} />
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
