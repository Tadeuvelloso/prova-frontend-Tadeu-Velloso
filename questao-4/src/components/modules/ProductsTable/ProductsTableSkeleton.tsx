import { PRODUCT_COLUMNS } from './columns'

interface ProductsTableSkeletonProps {
  rows?: number
}

/**
 * Reproduz a grade exata da tabela enquanto os dados carregam.
 *
 * A escolha por esqueleto, e não por um "Carregando…" centralizado, é para
 * não haver salto de layout: a caixa já ocupa o espaço final, e quando os
 * dados chegam o conteúdo aparece no lugar onde a pessoa já estava olhando.
 * As colunas vêm do mesmo `PRODUCT_COLUMNS` da tabela, então as duas não
 * podem divergir.
 */
export function ProductsTableSkeleton({ rows = 5 }: ProductsTableSkeletonProps) {
  return (
    <div
      // Anuncia a espera uma vez, em vez de deixar o leitor de tela silencioso.
      role="status"
      aria-label="Carregando produtos"
      className="overflow-hidden rounded-lg border border-border-subtle bg-surface shadow-card"
    >
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
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
  )
}
