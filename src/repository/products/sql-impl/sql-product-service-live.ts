import * as Sc from '@effect/schema/Schema'
import * as Mysql from '@sqlfx/mysql'
import { Effect as T, Layer as L, ReadonlyArray as A } from 'effect'

import { Product } from '../../../models/Product.js'
import { ProductNotFoundError } from '../../../services/products/errors/ProductNotFoundError.js'
import { ProductRepositoryService } from '../products.js'

export const makeProductSqlLive = L.effect(
  ProductRepositoryService,
  T.gen(function* (_) {
    const mysql = yield* _(Mysql.tag)

    const getOneProductRepo: ProductRepositoryService['getOneProductRepo'] = id =>
      T.gen(function* (_) {
        const products = yield* _(
          mysql`SELECT * FROM product WHERE id = ${id}`
        )
        const productOption = A.get(products, 0)

        return yield* _(
          productOption,
          T.mapError(_ => ProductNotFoundError.of('Product not found')),
          T.flatMap(Sc.parse(Product))
        )
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
