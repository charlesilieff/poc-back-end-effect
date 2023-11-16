import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product'
import type { ProductNotFoundError } from './errors/ProductNotFoundError'

export interface ProductService {
  getProducts: () => T.Effect<never, never, ReadonlyArray<Product>>
  createProduct: (product: Product) => T.Effect<never, never, ProductId>
  getOneProduct: (id: ProductId) => T.Effect<never, ProductNotFoundError, Product>
  patchOneProduct: (product: Product) => T.Effect<never, never, ProductId>
  removeOneProduct: (id: ProductId) => T.Effect<never, never, ProductId>
}

export const ProductService = Context.Tag<ProductService>()
