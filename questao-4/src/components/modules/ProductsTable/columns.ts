/**
 * Definição das colunas em um lugar só.
 *
 * A tabela e o esqueleto de carregamento leem daqui. Sem isso, acrescentar
 * uma coluna exigiria lembrar de mexer nos dois — e o esqueleto passaria a
 * desenhar uma grade diferente da real, provocando salto de layout quando os
 * dados chegam.
 */
export interface ProductColumn {
  key: string
  label: string
  align: 'left' | 'right'
  /** Largura relativa usada só pelo esqueleto, para imitar o conteúdo real. */
  skeletonWidth: string
}

export const PRODUCT_COLUMNS: readonly ProductColumn[] = [
  { key: 'name', label: 'Produto', align: 'left', skeletonWidth: 'w-40' },
  { key: 'sku', label: 'SKU', align: 'left', skeletonWidth: 'w-24' },
  { key: 'category', label: 'Categoria', align: 'left', skeletonWidth: 'w-28' },
  { key: 'salePrice', label: 'Preço de venda', align: 'right', skeletonWidth: 'w-20' },
  { key: 'stock', label: 'Estoque', align: 'right', skeletonWidth: 'w-12' },
  { key: 'active', label: 'Status', align: 'left', skeletonWidth: 'w-16' },
]
