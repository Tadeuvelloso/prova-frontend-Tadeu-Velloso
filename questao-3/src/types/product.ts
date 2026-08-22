export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: Category
  image: string
  rating: ProductRating
}

/**
 * As categorias não são fixas no código: vêm de `/products/categories`.
 * O alias existe para deixar as assinaturas legíveis sem fingir que o
 * conjunto de valores é conhecido em tempo de compilação.
 */
export type Category = string
