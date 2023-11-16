import { Effect as T, Layer as L, pipe } from 'effect'

import { ProductRepositoryService } from '../../../repository/products/products.js'
import { ProductNotFoundError } from '../errors/ProductNotFoundError.js'
import { ProductService } from '../products-service.js'

export const makeProductServiceLive = L.effect(
  ProductService,
  T.gen(function* (_) {
    const {
      getOneProductRepo,
      getProductsRepo,
      patchOneProductRepo,
      postProductsRepo,
      removeOneProductRepo
    } = yield* _(ProductRepositoryService)

    const getOneProduct: ProductService['getOneProduct'] = id =>
      pipe(
        getOneProductRepo(id),
        T.tapError(T.logError),
        T.mapError(e => ProductNotFoundError.of(`Product not found: ${e._tag}`))
      )

    const getProducts: ProductService['getProducts'] = () =>
      pipe(
        getProductsRepo(),
        T.tapError(errors => T.logError(errors)),
        T.catchAll(() => T.die('Not found'))
      )

    const patchOneProduct: ProductService['patchOneProduct'] = product =>
      pipe(patchOneProductRepo(product), T.catchAll(() => T.die('Not found')))

    const postProducts: ProductService['createProduct'] = product =>
      pipe(postProductsRepo(product), T.catchAll(e => T.die(`Something went wrong : ${e._tag}`)))

    const removeOneProduct: ProductService['removeOneProduct'] = id =>
      pipe(
        removeOneProductRepo(id),
        T.tapError(errors => T.logError(errors)),
        T.catchAll(() => T.die('Not found'))
      )

    return ProductService.of({
      getOneProduct,
      getProducts,
      patchOneProduct,
      createProduct: postProducts,
      removeOneProduct
    })
  })
)
