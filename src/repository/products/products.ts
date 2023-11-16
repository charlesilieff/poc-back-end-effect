import type { ParseError } from '@effect/schema/ParseResult'
import type { ResultLengthMismatch, SchemaError, SqlError } from '@sqlfx/mysql/Error'
import { Context, type Effect as T } from 'effect'

import type { Product, ProductId } from '../../models/Product.js'
import type { ProductNotFoundError } from '../../services/products/errors/ProductNotFoundError.js'

export interface ProductRepositoryService {
  getProductsRepo: () => T.Effect<never, SqlError | ParseError, ReadonlyArray<Product>>
  postProductsRepo: (
    product: Product
  ) => T.Effect<never, SqlError | ParseError | ResultLengthMismatch | SchemaError, ProductId>
  getOneProductRepo: (
    id: ProductId
  ) => T.Effect<never, SqlError | ParseError | ProductNotFoundError, Product>
  patchOneProductRepo: (product: Product) => T.Effect<never, SqlError | ParseError, ProductId>
  removeOneProductRepo: (id: ProductId) => T.Effect<never, SqlError | ParseError, ProductId>
}

export const ProductRepositoryService = Context.Tag<ProductRepositoryService>()
