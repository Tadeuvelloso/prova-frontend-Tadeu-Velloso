import type { Product, SortField, SortState } from '../../../types/product'
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
    <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface">
      <table className="w-full min-w-3xl border-collapse text-left text-sm">
        <caption className="sr-only">
          Lista de produtos da Fake Store API, ordenável por título, preço e avaliação
        </caption>

        <thead className="bg-surface-muted text-xs text-content-muted">
          <tr>
            <SortableHeader field="title" label="Produto" sort={sort} onSort={onSort} />

            <th scope="col" className="px-4 py-3 font-medium tracking-wide uppercase">
              Categoria
            </th>

            <SortableHeader
              field="price"
              label="Preço"
              sort={sort}
              onSort={onSort}
              align="right"
            />
            <SortableHeader
              field="rating"
              label="Avaliação"
              sort={sort}
              onSort={onSort}
              align="right"
            />
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
