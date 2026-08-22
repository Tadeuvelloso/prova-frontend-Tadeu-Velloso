import { useMemo, useState } from 'react'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { ProductsFilters } from '../components/modules/ProductsFilters/ProductsFilters'
import { ProductsTable } from '../components/modules/ProductsTable/ProductsTable'
import { ProductsTableSkeleton } from '../components/modules/ProductsTable/ProductsTableSkeleton'
import { useProducts } from '../hooks/useProducts'
import { useProductsFilters } from '../hooks/useProductsFilters'
import type { ProductStatusFilter } from '../types/product'
import { statusToFilters } from '../utils/productFilters'

export function ProductsPage() {
  /**
   * O status mora aqui, e não no `useProductsFilters`, porque é o único
   * filtro que vai ao servidor: mudá-lo muda a chave da query e, com ela, a
   * requisição. Nome e faixa de preço trabalham sobre a lista já carregada.
   */
  const [status, setStatus] = useState<ProductStatusFilter>('all')

  const serverFilters = useMemo(() => statusToFilters(status), [status])
  const { data, isPending, isError, error, refetch, isFetching } = useProducts(serverFilters)

  const products = useMemo(() => data ?? [], [data])
  const filters = useProductsFilters(products)

  const isFiltering = filters.hasActiveFilters || status !== 'all'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-content">
          Produtos
        </h2>

        {!isPending && !isError && (
          // `aria-live` porque este número muda sem recarregar a página:
          // quem usa leitor de tela precisa ouvir o resultado do filtro.
          <p aria-live="polite" className="font-mono text-xs text-content-muted tabular-nums">
            {formatCount(filters.matchedProducts.length, products.length, isFiltering)}
          </p>
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
        onStatusChange={setStatus}
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
        // Esmaece durante o refetch do filtro de status, sinalizando que o
        // conteúdo está sendo substituído sem trocar tudo pelo esqueleto —
        // é o par visual do `keepPreviousData`.
        <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <ProductsTable products={filters.matchedProducts} />
        </div>
      )}
    </div>
  )
}

/**
 * Distingue catálogo vazio de filtro sem resultado.
 *
 * São situações diferentes e pedem saídas diferentes: no primeiro caso não há
 * o que fazer além de cadastrar; no segundo, a lista existe e o caminho é
 * afrouxar o filtro — por isso o botão só aparece ali.
 */
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
