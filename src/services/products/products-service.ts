import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product.js'

export interface ProductService {
  getProducts: () => T.Effect<unknown, never, ReadonlyArray<Product>>
  postProducts: (product: Product) => T.Effect<unknown, never, number>
  getOneProduct: (id: ProductId) => T.Effect<unknown, never, Product>
  patchOneProduct: (product: Product) => T.Effect<unknown, never, number>
  removeOneProduct: (id: ProductId) => T.Effect<unknown, never, number>
}

export const ProductService = Context.Tag<ProductService>()
