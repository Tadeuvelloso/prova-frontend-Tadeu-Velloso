import { Link } from 'react-router-dom'
import { formatCurrency, formatNumber } from '../../../utils/formatters'
import type { Product } from '../../../types/product'
import { StatusBadge } from './StatusBadge'

interface ProductsCardsProps {
  products: Product[]
  canEdit: boolean
  canDelete: boolean
  onDelete: (product: Product) => void
}

export function ProductsCards({
  products,
  canEdit,
  canDelete,
  onDelete,
}: ProductsCardsProps) {
  return (
    <ul aria-label="Lista de produtos cadastrados" className="space-y-3">
      {products.map((product) => {
        const isLowStock = product.stock <= product.minStockAlert

        return (
          <li
            key={product._id}
            className="rounded-lg border border-border-subtle bg-surface p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-medium text-content">{product.name}</h3>
                <p className="font-mono text-xs text-content-muted">{product.sku}</p>
              </div>

              <StatusBadge active={product.active} />
            </div>

            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-xs text-content-muted">Categoria</dt>
                <dd className="truncate text-content">{product.category}</dd>
              </div>

              <div>
                <dt className="text-xs text-content-muted">Preço</dt>
                <dd className="font-mono text-content tabular-nums">
                  {formatCurrency(product.salePrice)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-content-muted">Estoque</dt>
                <dd
                  className={`font-mono tabular-nums ${
                    isLowStock ? 'text-danger' : 'text-content'
                  }`}
                >
                  {formatNumber(product.stock)}
                  {isLowStock && (
                    <span className="ml-1 text-[10px] uppercase">baixo</span>
                  )}
                </dd>
              </div>
            </dl>

            {(canEdit || canDelete) && (
              <div className="mt-4 flex justify-end gap-1 border-t border-border-subtle pt-3">
                {canEdit && (
                  <Link
                    to={`/produtos/${product._id}/editar`}
                    className="rounded px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
                  >
                    Editar
                    <span className="sr-only"> {product.name}</span>
                  </Link>
                )}

                {canDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="rounded px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
                  >
                    Excluir
                    <span className="sr-only"> {product.name}</span>
                  </button>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
