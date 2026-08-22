import type { SortField, SortState } from '../../../types/product'
import { headerCellClass } from './columns'

interface SortableHeaderProps {
  field: SortField
  label: string
  shortLabel?: string
  sort: SortState | null
  onSort: (field: SortField) => void
  align?: 'left' | 'right'
}

export function SortableHeader({
  field,
  label,
  shortLabel,
  sort,
  onSort,
  align = 'left',
}: SortableHeaderProps) {
  const isActive = sort?.field === field
  const ariaSort = isActive ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none'

  return (
    <th scope="col" aria-sort={ariaSort} className={headerCellClass({ align })}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1.5 transition-colors hover:text-brand ${
          isActive ? 'text-brand' : ''
        }`}
      >
        {shortLabel ? (
          <>
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          label
        )}
        <span aria-hidden="true" className={isActive ? '' : 'opacity-25'}>
          {isActive && sort.order === 'desc' ? '↓' : '↑'}
        </span>
      </button>
    </th>
  )
}
