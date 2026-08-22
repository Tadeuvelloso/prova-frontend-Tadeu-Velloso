import type { SortField, SortState } from '../../../types/product'

interface SortableHeaderProps {
  field: SortField
  label: string
  sort: SortState | null
  onSort: (field: SortField) => void
  align?: 'left' | 'right'
}

export function SortableHeader({
  field,
  label,
  sort,
  onSort,
  align = 'left',
}: SortableHeaderProps) {
  const isActive = sort?.field === field
  const ariaSort = isActive ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none'

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`px-4 py-3 font-medium ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1 tracking-wide uppercase transition hover:text-brand ${
          isActive ? 'text-brand' : ''
        }`}
      >
        {label}
        <span aria-hidden="true" className={isActive ? '' : 'opacity-30'}>
          {isActive && sort.order === 'desc' ? '↓' : '↑'}
        </span>
      </button>
    </th>
  )
}
