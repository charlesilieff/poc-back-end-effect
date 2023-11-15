import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product.js'

export interface ProductService {
  getProducts: () => T.Effect<never, never, ReadonlyArray<Product>>
  postProducts: (product: Product) => T.Effect<never, never, ProductId>
  getOneProduct: (id: ProductId) => T.Effect<never, never, Product>
  patchOneProduct: (product: Product) => T.Effect<never, never, ProductId>
  removeOneProduct: (id: ProductId) => T.Effect<never, never, ProductId>
}

export const ProductService = Context.Tag<ProductService>()
