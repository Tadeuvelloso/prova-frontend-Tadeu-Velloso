import type { SortField } from '../../../types/product'

interface ProductColumn {
  label: string
  /** Ausente quando a coluna não é ordenável. */
  field?: SortField
  align?: 'left' | 'right'
}

/**
 * Definição única das colunas, usada pela tabela e pelo skeleton. É o que
 * garante que o esqueleto de carregamento tenha exatamente a mesma grade da
 * tabela real, sem salto de layout quando os dados chegam.
 */
export const PRODUCT_COLUMNS: ProductColumn[] = [
  { label: 'Produto', field: 'title' },
  { label: 'Categoria' },
  { label: 'Preço', field: 'price', align: 'right' },
  { label: 'Avaliação', field: 'rating', align: 'right' },
]

export const headerCellClass = (align: ProductColumn['align']) =>
  `px-4 py-3 font-mono text-xs font-medium tracking-widest uppercase ${
    align === 'right' ? 'text-right' : 'text-left'
  }`
