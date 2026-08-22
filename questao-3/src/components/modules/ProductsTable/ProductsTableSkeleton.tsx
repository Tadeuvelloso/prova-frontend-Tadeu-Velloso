import { PAGE_SIZE } from '../../../utils/constants'
import { headerCellClass, PRODUCT_COLUMNS } from './columns'

const rows = Array.from({ length: PAGE_SIZE }, (_, index) => index)

function Bar({ className }: { className: string }) {
  return <span className={`block h-3 animate-pulse rounded-sm bg-border-subtle ${className}`} />
}

/**
 * Ocupa exatamente a grade da tabela real, com o mesmo número de linhas de
 * uma página: quando os dados chegam, nada salta de lugar.
 */
export function ProductsTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando produtos"
      className="overflow-x-auto rounded-md border border-border-subtle bg-surface"
    >
      <table className="w-full min-w-3xl border-collapse text-left text-sm">
        <thead className="bg-surface-muted text-content-muted">
          <tr>
            {PRODUCT_COLUMNS.map((column) => (
              <th key={column.label} scope="col" className={headerCellClass(column.align)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row} className="border-t border-border-subtle">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="size-10 shrink-0 animate-pulse rounded-sm bg-border-subtle" />
                  <Bar className="w-56" />
                </div>
              </td>
              <td className="px-4 py-3">
                <Bar className="w-24" />
              </td>
              <td className="px-4 py-3">
                <Bar className="ml-auto w-16" />
              </td>
              <td className="px-4 py-3">
                <Bar className="ml-auto w-28" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
