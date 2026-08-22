import type { SortField } from '../../../types/product'

interface ProductColumn {
  label: string
  shortLabel?: string
  field?: SortField
  align?: 'left' | 'right'
  hideBelowMd?: boolean
  grow?: boolean
}

export const COLUMNS = {
  title: { label: 'Produto', field: 'title', grow: true },
  category: { label: 'Categoria', hideBelowMd: true },
  price: { label: 'Preço', field: 'price', align: 'right' },
  rating: { label: 'Avaliação', shortLabel: 'Nota', field: 'rating', align: 'right' },
} satisfies Record<string, ProductColumn>

export const COLUMN_ORDER: ProductColumn[] = [
  COLUMNS.title,
  COLUMNS.category,
  COLUMNS.price,
  COLUMNS.rating,
]

type CellShape = Partial<ProductColumn>

export function cellClass(column: CellShape, extra = ''): string {
  return [
    'px-2 py-3 sm:px-4',
    column.align === 'right' ? 'text-right' : 'text-left',
    column.hideBelowMd ? 'hidden md:table-cell' : '',
    column.grow ? 'w-full' : 'whitespace-nowrap',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}

export function headerCellClass(column: CellShape): string {
  return cellClass(column, 'font-mono text-[0.65rem] font-medium tracking-widest uppercase sm:text-xs')
}
