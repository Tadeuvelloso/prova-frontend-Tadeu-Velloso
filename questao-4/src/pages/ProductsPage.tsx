import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { ProductsTable } from '../components/modules/ProductsTable/ProductsTable'
import { ProductsTableSkeleton } from '../components/modules/ProductsTable/ProductsTableSkeleton'
import { useProducts } from '../hooks/useProducts'

export function ProductsPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useProducts()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-content">
          Produtos
        </h2>

        {/* `aria-live` porque este número muda sem que a página recarregue —
            quem usa leitor de tela precisa ser avisado da mudança. */}
        {data && (
          <p aria-live="polite" className="font-mono text-xs text-content-muted tabular-nums">
            {data.length === 1 ? '1 produto' : `${data.length} produtos`}
          </p>
        )}
      </div>

      <ProductsContent
        products={data}
        isPending={isPending}
        isError={isError}
        errorMessage={error?.message}
        isFetching={isFetching}
        onRetry={() => void refetch()}
      />
    </div>
  )
}

interface ProductsContentProps {
  products: ReturnType<typeof useProducts>['data']
  isPending: boolean
  isError: boolean
  errorMessage?: string
  isFetching: boolean
  onRetry: () => void
}

/**
 * Os quatro estados da listagem, separados da página.
 *
 * Manter isto fora do corpo do `ProductsPage` evita a escada de `if`s antes do
 * `return` que esconde a estrutura da tela — e, quando os filtros entrarem,
 * o cabeçalho continua renderizado durante o carregamento, em vez de sumir
 * junto com a tabela.
 */
function ProductsContent({
  products,
  isPending,
  isError,
  errorMessage,
  isFetching,
  onRetry,
}: ProductsContentProps) {
  if (isPending) {
    return <ProductsTableSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        message={errorMessage ?? 'Ocorreu um erro inesperado.'}
        onRetry={onRetry}
        isRetrying={isFetching}
      />
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto cadastrado"
        description="O catálogo está vazio. Cadastre o primeiro produto para começar."
      />
    )
  }

  return <ProductsTable products={products} />
}
