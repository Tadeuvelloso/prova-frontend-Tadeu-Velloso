import { PRODUCT_COLUMNS } from './columns'

interface ProductsTableSkeletonProps {
  rows?: number
}

/**
 * Reproduz a grade exata da lista enquanto os dados carregam.
 *
 * A escolha por esqueleto, e não por um "Carregando…" centralizado, é para
 * não haver salto de layout: a caixa já ocupa o espaço final, e quando os
 * dados chegam o conteúdo aparece no lugar onde a pessoa já estava olhando.
 *
 * Segue a mesma quebra da lista real — tabela em tela larga, cartões em tela
 * estreita. Um esqueleto em grade sob uma lista de cartões produziria
 * exatamente o salto que ele existe para evitar.
 */
export function ProductsTableSkeleton({ rows = 5 }: ProductsTableSkeletonProps) {
  return (
    // O anúncio fica no contêiner, e não numa das variantes: assim ele vale
    // para as duas larguras, já que só uma delas está visível por vez.
    <div role="status" aria-label="Carregando produtos">
      <div className="animate-pulse space-y-3 sm:hidden">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border-subtle bg-surface p-4 shadow-card"
          >
            <div className="h-4 w-40 rounded bg-border-subtle" />
            <div className="mt-2 h-3 w-24 rounded bg-border-subtle" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-8 rounded bg-border-subtle" />
              <div className="h-8 rounded bg-border-subtle" />
              <div className="h-8 rounded bg-border-subtle" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-border-subtle bg-surface shadow-card sm:block">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              {/* As colunas vêm do mesmo `PRODUCT_COLUMNS` da tabela real,
                  então as duas grades não podem divergir. */}
              {PRODUCT_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-medium tracking-wide text-content-muted uppercase ${
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="animate-pulse">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border-subtle last:border-0">
                {PRODUCT_COLUMNS.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    <div
                      className={`h-4 rounded bg-border-subtle ${column.skeletonWidth} ${
                        column.align === 'right' ? 'ml-auto' : ''
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
