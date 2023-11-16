import * as Sc from '@effect/schema/Schema'
import * as Mysql from '@sqlfx/mysql'
import { Effect as T, Layer as L } from 'effect'

import { Product } from '../../../models/Product.js'
import { ProductRepositoryService } from '../products.js'

export const makeProductSqlLive = L.effect(
  ProductRepositoryService,
  T.gen(function* (_) {
    const mysql = yield* _(Mysql.tag)

    const getOneProductRepo: ProductRepositoryService['getOneProductRepo'] = id =>
      T.gen(function* (_) {
        const product = yield* _(
          mysql`SELECT * FROM product WHERE id = ${id}`
        )
        yield* _(T.logInfo(`One product founded : ${product}`))

        return yield* _(Sc.parse(Product)(product))
      })

    const getProductsRepo: ProductRepositoryService['getProductsRepo'] = () =>
      T.gen(function* (_) {
        const products = yield* _(
          mysql`SELECT * FROM product`
        )
        yield* _(T.logInfo(`All products founded : ${products}`))

        return yield* _(Sc.parse(Sc.array(Product))(products))
      })

    const patchOneProductRepo: ProductRepositoryService['patchOneProductRepo'] = () =>
      T.die('Not implemented')

    const postProductsRepo: ProductRepositoryService['postProductsRepo'] = product =>
      T.gen(function* (_) {
        yield* _(
          mysql`INSERT INTO product (code) VALUES (${product.code})`
        )
        yield* _(T.logInfo(`Product inserted : ${product}`))

        return product.id
      })

    const removeOneProductRepo: ProductRepositoryService['removeOneProductRepo'] = () =>
      T.die('Not implemented')

    return ProductRepositoryService.of({
      getOneProductRepo,
      getProductsRepo,
      patchOneProductRepo,
      postProductsRepo,
      removeOneProductRepo
    })
  })
)
