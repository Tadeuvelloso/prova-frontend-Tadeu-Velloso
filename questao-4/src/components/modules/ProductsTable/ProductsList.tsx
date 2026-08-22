import type { Product } from '../../../types/product'
import { ProductsCards } from './ProductsCards'
import { ProductsTable } from './ProductsTable'

interface ProductsListProps {
  products: Product[]
  canEdit: boolean
  canDelete: boolean
  onDelete: (product: Product) => void
}

/**
 * Escolhe a apresentação conforme a largura.
 *
 * A troca é por CSS, não por `window.innerWidth` em estado: medir a janela no
 * JavaScript significa renderizar uma vez com a suposição errada e corrigir
 * depois, o que pisca. Com `hidden`/`sm:block` o navegador decide antes da
 * primeira pintura.
 *
 * O custo é as duas árvores existirem no DOM. Para uma página de listagem
 * paginada — cinco a vinte e cinco itens — é irrelevante perto de um salto de
 * layout a cada carregamento.
 */
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
