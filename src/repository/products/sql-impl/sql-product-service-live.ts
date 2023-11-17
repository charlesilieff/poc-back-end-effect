import * as Sc from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import * as Mysql from '@sqlfx/mysql'
import { Effect as T, Layer as L, pipe, ReadonlyArray as A } from 'effect'

import { Product, ProductId } from '../../../models/Product.js'
import { ProductNotFoundError } from '../../../services/products/errors/ProductNotFoundError.js'
import { ProductRepositoryService } from '../products.js'

export const makeProductSqlLive = L.effect(
  ProductRepositoryService,
  T.gen(function* (_) {
    const mysql = yield* _(Mysql.tag)

    const getOneProductRepo: ProductRepositoryService['getOneProductRepo'] = id =>
      T.gen(function* (_) {
        const products = yield* _(
          mysql`SELECT * FROM products WHERE id = ${id}`
        )
        const productOption = A.get(products, 0)

        return yield* _(
          productOption,
          T.mapError(_ => ProductNotFoundError.of('Product not found')),
          T.flatMap(p =>
            pipe(
              p,
              Sc.parse(Product),
              T.tapError(e =>
                T.logError(`Parse errors from database datas: ${formatErrors(e.errors)}`)
              )
            )
          )
        )
      })

    const getProductsRepo: ProductRepositoryService['getProductsRepo'] = () =>
      T.gen(function* (_) {
        const products = yield* _(
          mysql`SELECT * FROM products`
        )
        yield* _(T.logInfo(`${products.length} products founded.`))

        return yield* _(Sc.parse(Sc.array(Product))(products), T.tapError(T.logError))
      })

    const patchOneProductRepo: ProductRepositoryService['patchOneProductRepo'] = () =>
      T.die('Not implemented')

    const postProductsRepo: ProductRepositoryService['postProductsRepo'] = product =>
      T.gen(function* (_) {
        yield* _(T.logInfo(`Inserting a product ${product.code}`))

        const { id } = yield* _(
          mysql.resolver(
            'Insert a Product',
            {
              result: Sc.struct({ id: ProductId }),
              request: pipe(Product, Sc.omit('id')),
              run: requests =>
                mysql`
              INSERT INTO products
              ${mysql.insert(requests)} RETURNING id
            `
            }
          ).execute(product)
        )

        return id
      }).pipe(T.tapError(T.logError))

    const removeOneProductRepo: ProductRepositoryService['removeOneProductRepo'] = id =>
      T.gen(function* (_) {
        yield* _(T.logInfo(`Removing a product with id = ${id}`))
        yield* _(
          mysql`DELETE FROM products WHERE id = ${id}`
        )

        return id
      }).pipe(T.tapError(T.logError))

    return ProductRepositoryService.of({
      getOneProductRepo,
      getProductsRepo,
      patchOneProductRepo,
      postProductsRepo,
      removeOneProductRepo
    })
  })
)
