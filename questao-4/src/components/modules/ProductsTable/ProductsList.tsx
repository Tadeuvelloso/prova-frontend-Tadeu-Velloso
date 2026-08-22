import type { Product } from '../../../types/product'
import { ProductsCards } from './ProductsCards'
import { ProductsTable } from './ProductsTable'

interface ProductsListProps {
  products: Product[]
  canEdit: boolean
  canDelete: boolean
  onDelete: (product: Product) => void
}

export function ProductsList(props: ProductsListProps) {
  return (
    <>
      <div className="hidden sm:block">
        <ProductsTable {...props} />
      </div>

      <div className="sm:hidden">
        <ProductsCards {...props} />
      </div>
    </>
  )
}
