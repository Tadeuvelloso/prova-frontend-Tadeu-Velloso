import type { Product } from '../../../types/product'
import { formatCurrency } from '../../../utils/formatters'
import { RatingMeter } from './RatingMeter'

interface ProductsTableRowProps {
  product: Product
}

export function ProductsTableRow({ product }: ProductsTableRowProps) {
  return (
    <tr className="border-t border-border-subtle transition-colors hover:bg-surface-muted">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="size-10 shrink-0 rounded-sm border border-border-subtle bg-surface object-contain p-1"
          />
          <span className="line-clamp-2 text-content">{product.title}</span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="rounded-sm border border-border-subtle px-2 py-0.5 font-mono text-xs whitespace-nowrap text-content-muted">
          {product.category}
        </span>
      </td>

      <td className="px-4 py-3 text-right font-mono font-medium whitespace-nowrap text-content tabular-nums">
        {formatCurrency(product.price)}
      </td>

      <td className="px-4 py-3">
        <RatingMeter rating={product.rating} />
      </td>
    </tr>
  )
}
