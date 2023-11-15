import * as Sc from '@effect/schema/Schema'
import * as Mysql from '@sqlfx/mysql'
import { Effect as T, Layer as L } from 'effect'

import { ProductId } from '../../../models/Product.js'
import { ProductRepositoryService } from '../products.js'

export const makeProductSqlLive = L.effect(
  ProductRepositoryService,
  T.gen(function* (_) {
    const mysql = yield* _(Mysql.tag)

    const getOneProductRepo: ProductRepositoryService['getOneProductRepo'] = () =>
      T.gen(function* (_) {
        const _people = yield* _(
          mysql<{
            readonly id: number
            readonly name: string
          }>`SELECT * FROM products`
        )

        yield* _(T.unit)

        return ({ id: Sc.parseSync(ProductId)(1) })
      })

    const getProductsRepo: ProductRepositoryService['getProductsRepo'] = () =>
      T.gen(function* (_) {
        yield* _(T.unit)

        return [{ id: Sc.parseSync(ProductId)(1) }]
      })

    const patchOneProductRepo: ProductRepositoryService['patchOneProductRepo'] = () =>
      T.die('Not implemented')

    const postProductsRepo: ProductRepositoryService['postProductsRepo'] = () =>
      T.die('Not implemented')

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
