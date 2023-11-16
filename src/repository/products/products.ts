import type { ParseError } from '@effect/schema/ParseResult'
import type { SqlError } from '@sqlfx/mysql/Error'
import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product'
import type { ProductNotFoundError } from '../../services/products/errors/ProductNotFoundError'

export interface ProductRepositoryService {
  getProductsRepo: () => T.Effect<never, SqlError | ParseError, ReadonlyArray<Product>>
  postProductsRepo: (product: Product) => T.Effect<never, SqlError | ParseError, ProductId>
  getOneProductRepo: (
    id: ProductId
  ) => T.Effect<never, SqlError | ParseError | ProductNotFoundError, Product>
  patchOneProductRepo: (product: Product) => T.Effect<never, SqlError | ParseError, ProductId>
  removeOneProductRepo: (id: ProductId) => T.Effect<never, SqlError | ParseError, ProductId>
}

export const ProductRepositoryService = Context.Tag<ProductRepositoryService>()
