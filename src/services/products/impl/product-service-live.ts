import { Effect as T, Layer as L, pipe } from 'effect'

import { ProductRepositoryService } from '../../../repository/products/products.js'
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
      pipe(getOneProductRepo(id), T.catchAll(() => T.die('Not found')))

    const getProducts: ProductService['getProducts'] = () =>
      pipe(
        getProductsRepo(),
        T.tapError(errors => T.logError(errors)),
        T.catchAll(() => T.die('Not found'))
      )

    const patchOneProduct: ProductService['patchOneProduct'] = product =>
      pipe(patchOneProductRepo(product), T.catchAll(() => T.die('Not found')))

    const postProducts: ProductService['postProducts'] = product =>
      pipe(postProductsRepo(product), T.catchAll(() => T.die('Something went wrong')))

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
      postProducts,
      removeOneProduct
    })
  })
)
