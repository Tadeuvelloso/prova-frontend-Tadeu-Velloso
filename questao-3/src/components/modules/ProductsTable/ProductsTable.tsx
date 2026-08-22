import type { Product, SortField, SortState } from '../../../types/product'
import { headerCellClass, PRODUCT_COLUMNS } from './columns'
import { ProductsTableRow } from './ProductsTableRow'
import { SortableHeader } from './SortableHeader'

interface ProductsTableProps {
  products: Product[]
  sort: SortState | null
  onSort: (field: SortField) => void
}

export function ProductsTable({ products, sort, onSort }: ProductsTableProps) {
  return (
    // A rolagem horizontal fica presa a este container: a página nunca rola.
    <div className="overflow-x-auto rounded-md border border-border-subtle bg-surface">
      <table className="w-full min-w-3xl border-collapse text-left text-sm">
        <caption className="sr-only">
          Lista de produtos, ordenável por título, preço e avaliação
        </caption>

        <thead className="bg-surface-muted text-content-muted">
          <tr>
            {PRODUCT_COLUMNS.map((column) =>
              column.field ? (
                <SortableHeader
                  key={column.label}
                  field={column.field}
                  label={column.label}
                  align={column.align}
                  sort={sort}
                  onSort={onSort}
                />
              ) : (
                <th key={column.label} scope="col" className={headerCellClass(column.align)}>
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
