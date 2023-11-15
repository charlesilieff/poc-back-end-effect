import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product.js'

export interface ProductRepositoryService {
  getProductsRepo: () => T.Effect<unknown, never, ReadonlyArray<Product>>
  postProductsRepo: (product: Product) => T.Effect<unknown, never, ProductId>
  getOneProductRepo: (id: ProductId) => T.Effect<unknown, never, Product>
  patchOneProductRepo: (product: Product) => T.Effect<unknown, never, ProductId>
  removeOneProductRepo: (id: ProductId) => T.Effect<unknown, never, ProductId>
}

export const ProductRepositoryService = Context.Tag<ProductRepositoryService>()
