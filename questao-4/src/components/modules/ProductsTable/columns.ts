export interface ProductColumn {
  key: string
  label: string
  align: 'left' | 'right'
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
