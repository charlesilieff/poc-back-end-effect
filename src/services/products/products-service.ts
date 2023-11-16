import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product.js'
import type { ProductNotFoundError } from './errors/ProductNotFoundError.js'

export interface ProductService {
  getProducts: () => T.Effect<never, never, ReadonlyArray<Product>>
  createProduct: (product: Product) => T.Effect<never, never, ProductId>
  getOneProduct: (id: ProductId) => T.Effect<never, ProductNotFoundError, Product>
  patchOneProduct: (product: Product) => T.Effect<never, never, ProductId>
  removeOneProduct: (id: ProductId) => T.Effect<never, ProductNotFoundError, ProductId>
}

export const ProductService = Context.Tag<ProductService>()
