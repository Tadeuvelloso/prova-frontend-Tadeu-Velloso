import type { Product } from '../../../types/product'
import { formatCurrency } from '../../../utils/formatters'
import { cellClass, COLUMNS } from './columns'
import { RatingMeter } from './RatingMeter'

interface ProductsTableRowProps {
  product: Product
}

export function ProductsTableRow({ product }: ProductsTableRowProps) {
  return (
    <tr className="border-t border-border-subtle transition-colors hover:bg-surface-muted">
      <td className={cellClass(COLUMNS.title)}>
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="hidden size-10 shrink-0 rounded-sm border border-border-subtle bg-surface object-contain p-1 sm:block"
          />
          <span className="line-clamp-2 text-content">{product.title}</span>
        </div>
      </td>

      <td className={cellClass(COLUMNS.category)}>
        <span className="rounded-sm border border-border-subtle px-2 py-0.5 font-mono text-xs whitespace-nowrap text-content-muted">
          {product.category}
        </span>
      </td>

      <td
        className={cellClass(
          COLUMNS.price,
          'font-mono text-xs font-medium text-content tabular-nums sm:text-sm',
        )}
      >
        {formatCurrency(product.price)}
      </td>

      <td className={cellClass(COLUMNS.rating)}>
        <RatingMeter rating={product.rating} />
      </td>
    </tr>
  )
}
