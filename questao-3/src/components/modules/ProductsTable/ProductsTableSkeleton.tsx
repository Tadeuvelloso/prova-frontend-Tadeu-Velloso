import { PAGE_SIZE } from '../../../utils/constants'
import { cellClass, COLUMN_ORDER, COLUMNS, headerCellClass } from './columns'

const rows = Array.from({ length: PAGE_SIZE }, (_, index) => index)

function Bar({ className }: { className: string }) {
  return <span className={`block h-3 animate-pulse rounded-sm bg-border-subtle ${className}`} />
}

export function ProductsTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando produtos"
      className="overflow-x-auto rounded-md border border-border-subtle bg-surface"
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-surface-muted text-content-muted">
          <tr>
            {COLUMN_ORDER.map((column) => (
              <th key={column.label} scope="col" className={headerCellClass(column)}>
                {column.shortLabel ? (
                  <>
                    <span className="sm:hidden">{column.shortLabel}</span>
                    <span className="hidden sm:inline">{column.label}</span>
                  </>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row} className="border-t border-border-subtle">
              <td className={cellClass(COLUMNS.title)}>
                <div className="flex items-center gap-3">
                  <span className="hidden size-10 shrink-0 animate-pulse rounded-sm bg-border-subtle sm:block" />
                  <Bar className="w-32 sm:w-56" />
                </div>
              </td>
              <td className={cellClass(COLUMNS.category)}>
                <Bar className="w-24" />
              </td>
              <td className={cellClass(COLUMNS.price)}>
                <Bar className="ml-auto w-16" />
              </td>
              <td className={cellClass(COLUMNS.rating)}>
                <Bar className="ml-auto w-16 md:w-28" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
