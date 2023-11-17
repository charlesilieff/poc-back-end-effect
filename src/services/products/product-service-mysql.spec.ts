import * as Sc from '@effect/schema/Schema'
import { Effect as T } from 'effect'
import { describe, expect, it } from 'vitest'

import { Product, ProductId } from '../../models/Product.js'
import { MysqlLive } from '../../repository/products/sql-impl/mysql-live.js'
import { makeProductSqlLive } from '../../repository/products/sql-impl/sql-product-service-live.js'
import { makeProductServiceLive } from './impl/product-service-mysql-live.js'
import { ProductService } from './products-service.js'

// TODO: after all tests delete all data
// TODO : provide service for all tests

describe('Product Service', () => {
  it(
    'should get a product',
    async () =>
      await T.gen(function* (_) {
        const productService = yield* _(ProductService)
        const productId = Sc.parseSync(ProductId)(1000)
        const product = yield* _(productService.getOneProduct(productId))

        expect(product.id).toBe(productId)
      }).pipe(
        T.provide(makeProductServiceLive),
        T.provide(makeProductSqlLive),
        T.provide(MysqlLive),
        T.runPromise
      )
  )

  it(
    'should create a product',
    async () =>
      await T.gen(function* (_) {
        const productService = yield* _(ProductService)
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
        const productId = yield* _(productService.createProduct(product))

        const productSaved = yield* _(productService.getOneProduct(productId))

        expect(productSaved.description).toBe(product.description)
      }).pipe(
        T.provide(makeProductServiceLive),
        T.provide(makeProductSqlLive),
        T.provide(MysqlLive),
        T.runPromise
      )
  )

  it(
    'should delete a product',
    async () =>
      await T.gen(function* (_) {
        const productService = yield* _(ProductService)
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
        const productId = yield* _(productService.createProduct(product))

        yield* _(productService.getOneProduct(productId))

        yield* _(productService.removeOneProduct(productId))

        const productNotFound = yield* _(
          productService.getOneProduct(productId),
          T.catchAll(T.succeed)
        )

        // @ts-expect-error if test pass productNotFound is an error
        expect(productNotFound._tag).toBe('ProductNotFoundError')
      }).pipe(
        T.provide(makeProductServiceLive),
        T.provide(makeProductSqlLive),
        T.provide(MysqlLive),
        T.runPromise
      )
  )
})

it(
  'dumb test',
  () => expect(1).toBe(1)
)
