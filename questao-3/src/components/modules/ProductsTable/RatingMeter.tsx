import type { ProductRating } from '../../../types/product'
import { formatRating } from '../../../utils/formatters'

const MAX_RATE = 5

interface RatingMeterProps {
  rating: ProductRating
}

export function RatingMeter({ rating }: RatingMeterProps) {
  const percentage = (rating.rate / MAX_RATE) * 100

  return (
    <div className="flex items-center justify-end gap-2 sm:gap-2.5">
      <span className="font-mono text-xs text-content tabular-nums sm:text-sm">
        {formatRating(rating.rate)}
        <span className="sr-only"> de {MAX_RATE}</span>
      </span>

      <span
        aria-hidden="true"
        className="h-1 w-8 shrink-0 overflow-hidden rounded-full bg-border-subtle sm:w-14"
      >
        <span className="block h-full bg-brand" style={{ width: `${percentage}%` }} />
      </span>

      <span className="hidden w-12 font-mono text-xs text-content-muted tabular-nums md:inline">
        {rating.count}
        <span className="sr-only"> avaliações</span>
      </span>
    </div>
  )
}
