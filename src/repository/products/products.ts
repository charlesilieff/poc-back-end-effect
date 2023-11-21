import type { PlatformError } from '@effect/platform-node/Error'
import type { ParseError } from '@effect/schema/ParseResult'
import type { ResultLengthMismatch, SchemaError, SqlError } from '@sqlfx/mysql/Error'
import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product.js'
import type { ProductNotFoundError } from '../../services/products/errors/ProductNotFoundError.js'

export interface ProductRepositoryService {
  // TODO : add error handling, errors type should not be SqlError | ParseError | PlatformError but something like ProductRepositoryError
  getProductsRepo: () => T.Effect<never, SqlError | ParseError | PlatformError, ReadonlyArray<Product>>
  postProductsRepo: (
    product: Product
  ) => T.Effect<never, SqlError | ParseError | ResultLengthMismatch | SchemaError | PlatformError, ProductId>
  getOneProductRepo: (
    id: ProductId
  ) => T.Effect<never, SqlError | ParseError | ProductNotFoundError | PlatformError, Product>
  patchOneProductRepo: (
    product: Product
  ) => T.Effect<
    never,
    ProductNotFoundError | SqlError | ResultLengthMismatch | SchemaError | PlatformError | ParseError,
    ProductId
  >
  removeOneProductRepo: (id: ProductId) => T.Effect<never, SqlError | ParseError | PlatformError, ProductId>
}

export const ProductRepositoryService = Context.Tag<ProductRepositoryService>()
