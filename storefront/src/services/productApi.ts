import { products } from '../data/products'
import type { Product } from '../types'

export const fetchProducts = async (): Promise<Product[]> => {
  return Promise.resolve(products)
}
