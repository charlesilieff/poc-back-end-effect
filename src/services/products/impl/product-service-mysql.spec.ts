import * as Sc from '@effect/schema/Schema'
import { Effect as T } from 'effect'

import { Product, ProductId } from '../../../models/Product'
import { MysqlLive } from '../../../repository/products/sql-impl/mysql-live'
import { makeProductSqlLive } from '../../../repository/products/sql-impl/sql-product-service-live'
import { ProductService } from '../products-service'
import { makeProductServiceLive } from './product-service-mysql-live'

// TODO: after all tests delete all data
// TODO : provide service for all tests

describe('Product Service', () => {
  it(
    'should get a product',
    async () =>
      await T.gen(function* (_) {
        const productService = yield* _(ProductService)
        const productId = Sc.parseSync(ProductId)(1)
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
        const product = Sc.parseSync(Product)({ code: '123', id: 10 })
        const productId = yield* _(productService.createProduct(product))

        expect(product.id).toBe(productId)
      }).pipe(
        T.provide(makeProductServiceLive),
        T.provide(makeProductSqlLive),
        T.provide(MysqlLive),
        T.runPromise
      )
  )
})
