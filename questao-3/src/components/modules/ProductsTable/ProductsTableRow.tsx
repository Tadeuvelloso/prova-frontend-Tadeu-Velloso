import type { Product } from '../../../types/product'
import { formatCurrency, formatRating } from '../../../utils/formatters'

interface ProductsTableRowProps {
  product: Product
}

export function ProductsTableRow({ product }: ProductsTableRowProps) {
  return (
    <tr className="border-t border-border-subtle transition hover:bg-surface-muted">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="size-10 shrink-0 object-contain"
          />
          <span className="line-clamp-2 font-medium text-content">{product.title}</span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium whitespace-nowrap text-brand">
          {product.category}
        </span>
      </td>

      <td className="px-4 py-3 text-right font-medium whitespace-nowrap text-content tabular-nums">
        {formatCurrency(product.price)}
      </td>

      <td className="px-4 py-3 text-right whitespace-nowrap text-content-muted tabular-nums">
        {formatRating(product.rating.rate)}
        <span className="ml-1 text-xs">({product.rating.count})</span>
      </td>
    </tr>
  )
}
