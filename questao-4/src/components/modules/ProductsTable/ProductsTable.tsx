import { Link } from 'react-router-dom'
import { formatCurrency, formatNumber } from '../../../utils/formatters'
import type { Product } from '../../../types/product'
import { PRODUCT_COLUMNS } from './columns'
import { StatusBadge } from './StatusBadge'

interface ProductsTableProps {
  products: Product[]
  canEdit: boolean
  canDelete: boolean
  onDelete: (product: Product) => void
}

export function ProductsTable({
  products,
  canEdit,
  canDelete,
  onDelete,
}: ProductsTableProps) {
  const showActions = canEdit || canDelete

  return (
    <div className="relative overflow-x-auto rounded-lg border border-border-subtle bg-surface shadow-card">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">Lista de produtos cadastrados</caption>

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

            {showActions && (
              <th scope="col" className="px-4 py-3 text-right">
                <span className="sr-only">Ações</span>
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              canEdit={canEdit}
              canDelete={canDelete}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductRow({
  product,
  canEdit,
  canDelete,
  onDelete,
}: {
  product: Product
  canEdit: boolean
  canDelete: boolean
  onDelete: (product: Product) => void
}) {
  const isLowStock = product.stock <= product.minStockAlert

  return (
    <tr className="border-b border-border-subtle last:border-0">
      <th scope="row" className="px-4 py-3 text-left font-medium text-content">
        {product.name}
      </th>

      <td className="px-4 py-3 font-mono text-xs text-content-muted">{product.sku}</td>

      <td className="px-4 py-3 text-content-muted">{product.category}</td>

      <td className="px-4 py-3 text-right font-mono text-content tabular-nums">
        {formatCurrency(product.salePrice)}
      </td>

      <td className="px-4 py-3 text-right font-mono tabular-nums">
        <span className={isLowStock ? 'text-danger' : 'text-content-muted'}>
          {formatNumber(product.stock)}
        </span>
        {isLowStock && (
          <span className="ml-1 text-[10px] text-danger uppercase">baixo</span>
        )}
      </td>

      <td className="px-4 py-3">
        <StatusBadge active={product.active} />
      </td>

      {(canEdit || canDelete) && (
        <td className="px-4 py-3">
          <div className="flex justify-end gap-1">
            {canEdit && (
              <Link
                to={`/produtos/${product._id}/editar`}
                className="rounded px-2 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
              >
                Editar
                <span className="sr-only"> {product.name}</span>
              </Link>
            )}

            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="rounded px-2 py-1 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
              >
                Excluir
                <span className="sr-only"> {product.name}</span>
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  )
}
