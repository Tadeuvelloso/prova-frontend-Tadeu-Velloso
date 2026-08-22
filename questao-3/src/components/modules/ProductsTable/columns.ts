import type { SortField } from '../../../types/product'

interface ProductColumn {
  label: string
  /** Rótulo curto usado em telas estreitas, quando o longo não cabe. */
  shortLabel?: string
  /** Ausente quando a coluna não é ordenável. */
  field?: SortField
  align?: 'left' | 'right'
  /**
   * Coluna secundária: só entra a partir de 768px. A miniatura volta em
   * 640px, então trazer a categoria junto espremeria o título de novo — os
   * elementos precisam voltar escalonados, não todos no mesmo breakpoint.
   */
  hideBelowMd?: boolean
  /** Coluna elástica: absorve a largura que sobra em vez de dividir por igual. */
  grow?: boolean
}

/**
 * Definição única das colunas, usada pela tabela, pelas linhas e pelo
 * skeleton. É o que garante que todos compartilhem a mesma grade — inclusive
 * quais colunas somem no mobile.
 */
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

// `Partial` e não `Pick`: as colunas que não declaram `align` nem `hideBelowMd`
// seriam rejeitadas pela checagem de weak type se o alvo só tivesse esses campos.
type CellShape = Partial<ProductColumn>

export function cellClass(column: CellShape, extra = ''): string {
  return [
    'px-2 py-3 sm:px-4',
    column.align === 'right' ? 'text-right' : 'text-left',
    column.hideBelowMd ? 'hidden md:table-cell' : '',
    // `w-full` numa célula de tabela faz o navegador dar a ela toda a sobra,
    // encolhendo as demais até o conteúdo — sem isso o título fica espremido.
    column.grow ? 'w-full' : 'whitespace-nowrap',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}

export function headerCellClass(column: CellShape): string {
  return cellClass(column, 'font-mono text-[0.65rem] font-medium tracking-widest uppercase sm:text-xs')
}
