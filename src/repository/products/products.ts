import type { SqlError } from '@sqlfx/mysql/Error'
import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product.js'

export interface ProductRepositoryService {
  getProductsRepo: () => T.Effect<never, SqlError, ReadonlyArray<Product>>
  postProductsRepo: (product: Product) => T.Effect<never, never, ProductId>
  getOneProductRepo: (id: ProductId) => T.Effect<never, SqlError, Product>
  patchOneProductRepo: (product: Product) => T.Effect<never, never, ProductId>
  removeOneProductRepo: (id: ProductId) => T.Effect<never, never, ProductId>
}

export const ProductRepositoryService = Context.Tag<ProductRepositoryService>()
