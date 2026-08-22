import type { Product } from '../../../types/product'
import { ProductsTableRow } from './ProductsTableRow'

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    // A rolagem horizontal fica presa a este container: a página nunca rola.
    <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface">
      <table className="w-full min-w-3xl border-collapse text-left text-sm">
        <caption className="sr-only">Lista de produtos da Fake Store API</caption>

        <thead className="bg-surface-muted text-xs tracking-wide text-content-muted uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Produto
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Categoria
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Preço
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Avaliação
            </th>
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
