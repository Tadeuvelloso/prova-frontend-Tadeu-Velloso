import type { Product, SortField, SortState } from '../../../types/product'
import { COLUMN_ORDER, headerCellClass } from './columns'
import { ProductsTableRow } from './ProductsTableRow'
import { SortableHeader } from './SortableHeader'

interface ProductsTableProps {
  products: Product[]
  sort: SortState | null
  onSort: (field: SortField) => void
}

export function ProductsTable({ products, sort, onSort }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border-subtle bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          Lista de produtos, ordenável por título, preço e avaliação
        </caption>

        <thead className="bg-surface-muted text-content-muted">
          <tr>
            {COLUMN_ORDER.map((column) =>
              column.field ? (
                <SortableHeader
                  key={column.label}
                  field={column.field}
                  label={column.label}
                  shortLabel={column.shortLabel}
                  align={column.align}
                  sort={sort}
                  onSort={onSort}
                />
              ) : (
                <th key={column.label} scope="col" className={headerCellClass(column)}>
                  {column.label}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductsTableRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
