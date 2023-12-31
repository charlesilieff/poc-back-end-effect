import type { PlatformError } from '@effect/platform-node/Error'
import type { ParseError } from '@effect/schema/ParseResult'
import * as Sc from '@effect/schema/Schema'
import type { ConfigError, Layer as L } from 'effect'
import { Effect as T } from 'effect'
import { describe, expect, it } from 'vitest'

import { Product } from '../../models/Product.js'
import { ProductId } from '../../models/ProductId.js'
import { ProductService } from './products-service.js'

// TODO: after all tests delete all data

export const ProductServiceTest = (
  layerProduct: L.Layer<never, ConfigError.ConfigError | PlatformError | ParseError, ProductService>
) => {
  describe('Product Service', () => {
    // TODO : generate a random product
    const product = Sc.parseSync(Product)({
      id: '',
      code: 'hellocode',
      name: 'hello',
      description: 'description',
      category: 'Clothing',
      inventoryStatus: 'LOWSTOCK',
      price: 0,
      quantity: 0,
      image: 'image',
      rating: 4
    })
    it(
      'should get a product',
      async () =>
        await T.gen(function* (_) {
          const productService = yield* _(ProductService)
          const productId = Sc.parseSync(ProductId)(1000)
          const product = yield* _(productService.getOneProduct(productId))

          expect(product.id).toBe(productId)
        }).pipe(T.provide(layerProduct), T.runPromise)
    )

    it(
      'get a product not in database should return an error',
      async () =>
        await T.gen(function* (_) {
          const productService = yield* _(ProductService)
          const productId = Sc.parseSync(ProductId)(100000)
          const productNotFound = yield* _(
            productService.getOneProduct(productId),
            T.catchAll(error => T.succeed(error))
          )

          // @ts-expect-error if test pass productNotFound is an error, and have a _tag property
          expect(productNotFound._tag).toBe('ProductNotFoundError')
        }).pipe(T.provide(layerProduct), T.runPromise)
    )

    it(
      'should create a product',
      async () =>
        await T.gen(function* (_) {
          const productService = yield* _(ProductService)
          const productId = yield* _(productService.createProduct(product))

          const productSaved = yield* _(productService.getOneProduct(productId))

          expect(productSaved.description).toBe(product.description)
        }).pipe(T.provide(layerProduct), T.runPromise)
    )

    it(
      'should delete a product',
      async () =>
        await T.gen(function* (_) {
          const productService = yield* _(ProductService)
          const productId = yield* _(productService.createProduct(product))

          yield* _(productService.getOneProduct(productId))

          yield* _(productService.removeOneProduct(productId))

          const productNotFound = yield* _(
            productService.getOneProduct(productId),
            T.catchAll(T.succeed)
          )

          // @ts-expect-error if test pass productNotFound is an error, and have a _tag property
          expect(productNotFound._tag).toBe('ProductNotFoundError')
        }).pipe(T.provide(layerProduct), T.runPromise)
    )

    it(
      'should update a product',
      async () =>
        await T.gen(function* (_) {
          const productService = yield* _(ProductService)

          const productId = yield* _(productService.createProduct(product))

          yield* _(productService.getOneProduct(productId))

          yield* _(
            productService.updateOneProduct({
              ...product,
              description: 'new description',
              id: productId
            })
          )

          const productUpdated = yield* _(
            productService.getOneProduct(productId)
          )

          expect(productUpdated.description).toBe('new description')
        }).pipe(T.provide(layerProduct), T.runPromise)
    )
  })
}
